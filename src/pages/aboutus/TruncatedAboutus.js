import { useEffect, useState } from "react";
import axios from "axios";
import { htmlToText } from "html-to-text";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

function TruncatedAboutus() {
  const [truncatedText, setTruncatedText] = useState("");

  useEffect(() => {
    axios.get(BASE_API_URL + "about-us").then((response) => {
      if (response?.data?.result === true) {
        const text = htmlToText(response?.data?.data?.aboutus, {
          wordwrap: 250,
        });
        const truncated = `${text.substring(0, text.indexOf("\n") + 1)}....`;
        setTruncatedText(truncated);
      }
    })
  }, []);
  return truncatedText
}

export default TruncatedAboutus;