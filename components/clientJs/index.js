import { ClientJS } from "clientjs";
import { useEffect } from "react";

export default function ClientJsComponent({ setFingerPrint }) {
  useEffect(() => {
    const client = new ClientJS();
    const fingerprint = client.getFingerprint();
    setFingerPrint(fingerprint);
  }, []);

  return null;
}