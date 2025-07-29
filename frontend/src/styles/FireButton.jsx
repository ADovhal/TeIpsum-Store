import React from "react";
import Lottie from "lottie-react";
import fireAnimation from "../assets/animations/fireForButton.json";
import styles from "./FireButton.module.css";

const FireButton = ({ children, ...props }) => {
  return (
    <div className={styles.wrapper}>
        <Lottie 
          animationData={fireAnimation} 
          loop={true} 
          className={styles.flame} 
          tabIndex="-1"
        />
      <button className={styles.button} {...props} tabIndex={-1} aria-hidden="true">
        {children}
      </button>
    </div>
  );
};

export default FireButton;