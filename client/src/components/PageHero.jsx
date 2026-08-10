import { motion } from 'framer-motion';

const HERO_IMAGE_WRAPPER_CLASS = 'relative h-[300px] w-full overflow-hidden rounded-[2.25rem] border border-white/75 shadow-[0_22px_60px_rgba(84,59,39,0.12)] sm:h-[380px] md:h-[500px]';
const HERO_IMAGE_CLASS = 'h-full w-full object-cover object-center';

export default function PageHero({ title, description, kicker, image, imageClassName = '' }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.7),_rgba(246,238,228,0.85)_34%,_rgba(238,228,216,0.96))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      <div className="section-shell relative grid items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {kicker ? (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="page-ribbon"
            >
              {kicker}
            </motion.p>
          ) : null}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight text-text sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.4rem]"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 max-w-2xl text-sm leading-7 text-text/70 sm:text-base sm:leading-8 md:text-lg"
          >
            {description}
          </motion.p>
        </motion.div>
        {image ? (
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className={HERO_IMAGE_WRAPPER_CLASS}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -left-6 top-8 h-32 w-32 rounded-full bg-secondary/40 blur-3xl"
            />
            <motion.img
              src={image}
              alt={title}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className={`${HERO_IMAGE_CLASS} ${imageClassName}`.trim()}
            />
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
