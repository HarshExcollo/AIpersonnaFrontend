import React from "react";
import ReactMarkdown from "react-markdown";

interface FormattedOutputProps {
  content: string;
}

const FormattedOutput: React.FC<FormattedOutputProps> = ({ content }) => (
  <div>
    <ReactMarkdown>{content}</ReactMarkdown>
  </div>
);

export default FormattedOutput;
