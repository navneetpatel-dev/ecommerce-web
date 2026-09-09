"use client";

import { useState } from "react";
import {
  useConfirmDelivery,
  useConfirmRtoHandover,
  useRequestDeliveryCode,
  useRequestRtoHandoverCode,
  useUpdateDeliveryStatus,
} from "../api/deliveryAgent.queries";
import { usePresignUpload } from "@/shared/hooks/useUploads.hook";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { isOffline } from "../offline/deliveryOfflineQueue";
import { uploadDeliveryProofIfPresent } from "../utils/deliveryProofUpload";

/**
 * Owns all mutable state and mutation orchestration for a delivery task
 * detail page: status updates (with proof-photo upload and offline guard),
 * doorstep confirmation, and RTO vendor handover.
 */
export function useDeliveryTaskActions(
  shipmentId: string,
  codAmount: number | null | undefined,
) {
  const update = useUpdateDeliveryStatus();
  const confirm = useConfirmDelivery();
  const requestCode = useRequestDeliveryCode();
  const upload = usePresignUpload();
  const requestRtoCode = useRequestRtoHandoverCode();
  const confirmRto = useConfirmRtoHandover();

  const [otpCode, setOtpCode] = useState("");
  const [failureNote, setFailureNote] = useState("");
  const [failurePhoto, setFailurePhoto] = useState<File | null>(null);
  const [proof, setProof] = useState<File | null>(null);
  const [codCollected, setCodCollected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rtoOtpCode, setRtoOtpCode] = useState("");

  const runStatus = async (status: string, note?: string) => {
    setError(null);
    try {
      let photoUrl: string | undefined;
      if (status === "FAILED" && failurePhoto) {
        if (isOffline()) {
          setError(
            "Proof photos require active internet connectivity. Remove the photo to record this attempt offline, or try again when back online.",
          );
          return;
        }
        photoUrl = await uploadDeliveryProofIfPresent(
          upload,
          shipmentId,
          failurePhoto,
        );
      }
      await update.mutateAsync({ shipmentId, status, note, photoUrl });
      if (status === "FAILED") {
        setFailureNote("");
        setFailurePhoto(null);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not update delivery status."));
    }
  };

  const complete = async () => {
    setError(null);
    if (isOffline()) {
      setError(
        "Doorstep confirmation requires internet connectivity to verify the customer passcode.",
      );
      return;
    }
    try {
      const proofPhotoUrl = await uploadDeliveryProofIfPresent(
        upload,
        shipmentId,
        proof,
      );
      await confirm.mutateAsync({
        shipmentId,
        otpCode,
        proofPhotoUrl,
        codCollected: codAmount != null ? codCollected : undefined,
      });
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not confirm delivery."));
      return false;
    }
  };

  const completeRtoHandover = async () => {
    setError(null);
    try {
      await confirmRto.mutateAsync({ shipmentId, otpCode: rtoOtpCode });
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not confirm vendor handover."));
      return false;
    }
  };

  return {
    otpCode,
    setOtpCode,
    failureNote,
    setFailureNote,
    failurePhoto,
    setFailurePhoto,
    proof,
    setProof,
    codCollected,
    setCodCollected,
    error,
    rtoOtpCode,
    setRtoOtpCode,
    update,
    confirm,
    requestCode,
    upload,
    requestRtoCode,
    confirmRto,
    runStatus,
    complete,
    completeRtoHandover,
  };
}
