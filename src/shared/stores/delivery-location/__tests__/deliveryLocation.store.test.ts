import { beforeEach, describe, expect, it } from "vitest";
import { STORAGE_KEYS } from "@/shared/constants/storage/storage";
import { useDeliveryLocationStore } from "../deliveryLocation.store";
import { readStoredDeliveryLocation } from "../deliveryLocationStorage";

/**
 * The funnel's gates all read this one area, and it is persisted — so both halves matter:
 * what is in the store now, and what a page load will find in sessionStorage.
 */
describe("delivery location store", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    useDeliveryLocationStore.setState({ pincode: null, state: null });
  });

  it("keeps the area the customer checked, with its region", () => {
    useDeliveryLocationStore
      .getState()
      .setDeliveryLocation("560001", "Karnataka");

    expect(useDeliveryLocationStore.getState().pincode).toBe("560001");
    expect(useDeliveryLocationStore.getState().state).toBe("Karnataka");
  });

  it("persists the area for the rest of the session", () => {
    useDeliveryLocationStore.getState().setDeliveryLocation("400001");

    expect(readStoredDeliveryLocation()).toEqual({
      pincode: "400001",
      state: null,
    });
  });

  it("clears the area from the store and from storage", () => {
    useDeliveryLocationStore.getState().setDeliveryLocation("400001");

    useDeliveryLocationStore.getState().clearDeliveryLocation();

    expect(useDeliveryLocationStore.getState().pincode).toBeNull();
    expect(
      window.sessionStorage.getItem(STORAGE_KEYS.DELIVERY_LOCATION),
    ).toBeNull();
  });

  it("ignores a stored value that is not a usable pincode", () => {
    window.sessionStorage.setItem(
      STORAGE_KEYS.DELIVERY_LOCATION,
      JSON.stringify({ pincode: "abc" }),
    );

    expect(readStoredDeliveryLocation()).toEqual({
      pincode: null,
      state: null,
    });
  });

  it("survives unparseable storage without taking the funnel down", () => {
    window.sessionStorage.setItem(STORAGE_KEYS.DELIVERY_LOCATION, "{not json");

    expect(readStoredDeliveryLocation()).toEqual({
      pincode: null,
      state: null,
    });
  });
});
