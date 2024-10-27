import { motion } from 'framer-motion';

export default function SlideDown({ children, delay = 0, duration = 0.5}) {
  return (
    <motion.div
    style={{ position: "relative", zIndex: 10, overflow: "visible" }}
      variants={{
        hidden: {
          opacity: 0,
          y: 15,
        },
        visible: {
          opacity: 1,
          y: 0,
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay, type: "spring", duration }}
    >
      {children}
    </motion.div>
  );
}