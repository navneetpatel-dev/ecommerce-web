import { memo } from "react";
import { motion } from "motion/react";
import type { SubOrder } from "@/shared/api/types";
import { SubOrderCardContainer } from "../../containers/sub-order/SubOrderCardContainer.container";
import { ORDER_DETAIL_CONTENT_STYLES } from "../../styles/detail/orderDetailContent.styles";

interface SubOrdersListProps {
  subOrders: SubOrder[];
}

function subOrderEntrance(index: number) {
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.28,
      delay: Math.min(0.04 * index, 0.16),
      ease: [0.2, 0, 0, 1] as const,
    },
  };
}

export const SubOrdersList = memo(function SubOrdersList({
  subOrders,
}: SubOrdersListProps) {
  return (
    <div className={ORDER_DETAIL_CONTENT_STYLES.subOrdersList}>
      {subOrders.map((subOrder, index) => (
        <motion.div key={subOrder.id} {...subOrderEntrance(index)}>
          <SubOrderCardContainer subOrder={subOrder} />
        </motion.div>
      ))}
    </div>
  );
});
