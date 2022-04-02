import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    description: (
      <>
        Designed to work with the power of blockchain, you only need to connect with your favorite wallet.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    description: (
      <>
        Two rules, investor or administrator.
      </>
    ),
  },
  {
    title: 'Powered by Avax',
    description: (
      <>
        Builded during the AVALANCHE SUMMIT 2022, the project run on C-CHAIN.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
