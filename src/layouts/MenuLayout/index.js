'use client';
import React, { useContext, useState } from 'react';
import styles from './index.module.scss';
import { useRouter } from 'next/navigation';


const HeaderWSideNav = (props) => {
  const router = useRouter();
  return (
    <div className={styles.layoutCont}>
      {props.children}
    </div>
  );
};

export default HeaderWSideNav;
