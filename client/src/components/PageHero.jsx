import { motion } from 'framer-motion';

export default function PageHero({ title, description, kicker, image }) {
  return (
    <section className="bg-hero-gradient">
      <div className="section-shell grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
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
              className="text-xs font-bold uppercase tracking-[0.35em] text-primary"
            >
              {kicker}
            </motion.p>
          ) : null}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight text-text sm:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 max-w-2xl text-base leading-8 text-text/70 sm:text-lg"
          >
            {description}
          </motion.p>
        </motion.div>
        {image ? (
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="relative"
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
              className="relative h-[360px] w-full rounded-[2rem] object-cover shadow-soft sm:h-[460px]"
            />
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
