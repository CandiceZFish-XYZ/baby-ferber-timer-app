import React from "react";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";
import { Icon } from "@chakra-ui/react";

export default function Github() {
  return (
    <a
      href="https://github.com/CandiceZFish-XYZ/baby-ferber-timer-app"
      target="_blank"
    >
      <Icon as={FaGithub} boxSize={7} />
    </a>
  );
}
