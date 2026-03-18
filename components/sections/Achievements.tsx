"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import achievementsData from "@/data/achievements.json";
import SectionWrapper from "@/components/ui/SectionWrapper";
import InfiniteMenu from "@/components/ui/infinite-menu";

export default function Achievements() {
  const [menuScale, setMenuScale] = useState(1.2);

  const achievementItems = useMemo(
    () =>
      achievementsData.achievements.map((item) => ({
        image: item.image,
        link: "",
        title: item.title,
        description: item.description,
      })),
    []
  );

  useEffect(() => {
    const updateScale = () => {
      setMenuScale(window.innerWidth < 768 ? 0.9 : 1.2);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <SectionWrapper id="achievements" className="bg-dark-surface/30 py-20" variant="slideLeft">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <h2 className="section-heading gradient-text">Achievements</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-3 text-base">
            A 3D showcase of my milestones across competitions, academics, and coding.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-[500px] md:h-[600px] relative rounded-2xl overflow-hidden border border-white/10 bg-black/35"
        >
          <InfiniteMenu items={achievementItems} scale={menuScale} />
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
