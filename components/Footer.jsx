import React from "react";
import { AiFillLinkedin, AiOutlineGithub } from "react-icons/ai";

const Footer = () => {
  return (
    <div className="footer-container">
      <p>2023 Yuhao Headphones. All rights reserverd.</p>
      <p className="icons">
        <a
          href="https://www.linkedin.com/in/khalilpeng/"
          target="_blank"
          rel="noreferrer"
        >
          <AiFillLinkedin />
        </a>
        <a href="https://github.com/khalilpyh" target="_blank" rel="noreferrer">
          <AiOutlineGithub />
        </a>
      </p>
    </div>
  );
};

export default Footer;
