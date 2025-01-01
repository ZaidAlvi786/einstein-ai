import Image from "next/image";

const PrivacyPolicyModal = ({ setIsPrivacyPolicyModalOpen }) => {
  
  return (
    <div className="modal-container">
      <div
        className="modal-backdropp bg-[#000] fixed top-[0] left-[0] w-[100%] h-[100%] z-[1001]"
        onClick={() => setIsPrivacyPolicyModalOpen(false)}
      ></div>
      <div className="modal-box">
        <div className="modal-header flex justify-end gap-4 sticky right-[10px] -top-[20px] bg-[#000] py-2">
          <Image
            className="close-icon"
            alt="link icon"
            width={18}
            height={18}
            src={"svg/Icon-link.svg"}
          />
          <Image
            className="close-icon"
            alt="download icon"
            width={22}
            height={18}
            src={"svg/Icon-download.svg"}
          />
          <Image
            onClick={() => setIsPrivacyPolicyModalOpen(false)}
            className="close-icon"
            alt="close icon"
            width={18}
            height={18}
            src={"svg/Icon-close.svg"}
          />
        </div>
        <div className="modal-content-scrollable">
          <div className="modal-content">
            <h2 className="modal-heading">Einstein Privacy Policy</h2>

            <div className="modal-section">
              <h3 className="modal-subheading">Introduction</h3>
              <p>
                Einstein AI ("Einstein", "we", "us", or "our") respects the
                privacy of its users ("user", "you", or "your") and is committed
                to protecting your personal information. This Privacy Policy
                outlines our practices regarding the collection, use, and
                disclosure of your information through the use of our Einstein
                AI application ("Application") and any of our services
                (collectively, "Services").
              </p>
            </div>

            <div className="modal-section">
              <h3 className="modal-subheading">Collection of Information</h3>
              <p>
                We collect information that you provide directly to us, such as
                when you create an account, use our Services, or communicate
                with us. This information may include your name, email address,
                and any other information you choose to provide. We also collect
                non-personally identifiable information, such as usage data and
                device identifiers, to improve our Services.
              </p>
            </div>

            <div className="modal-section">
              <h3 className="modal-subheading">Use of Information</h3>
              <p>
                The information we collect is used to provide, maintain, and
                improve our Services, to communicate with you, and to
                personalize your experience. We do not use your data without
                your consent, except as required by law or as necessary to
                provide our Services to you.
              </p>
            </div>

            <div className="modal-section">
              <h3 className="modal-subheading">
                Sharing and Disclosure of Information
              </h3>
              <p>
                We do not sell your sensitive data to third parties. Information
                may be shared with third-party service providers who perform
                services on our behalf, under strict privacy agreements. We may
                also disclose your information if required by law or to protect
                our rights and the safety of our users.
              </p>
            </div>

            <div className="modal-section">
              <h3 className="modal-subheading">Data Security</h3>
              <p>
                We implement appropriate technical and organizational measures
                to protect the security of your personal information. However,
                no security system is impenetrable, and we cannot guarantee the
                security of our data.
              </p>
            </div>

            <div className="modal-section">
              <h3 className="modal-subheading">Limitation of Liability</h3>
              <p>
                Einstein AI provides its Services "as is" and makes no
                representations or warranties of any kind, express or implied,
                as to the Services' operation or the information, content,
                materials, or products included on the Services. To the full
                extent permissible by applicable law, Einstein disclaims all
                warranties, express or implied, including, but not limited to,
                implied warranties of merchantability and fitness for a
                particular purpose. Einstein will not be liable for any damages
                of any kind arising from the use of the Services, including, but
                not limited to direct, indirect, incidental, punitive, and
                consequential damages.
              </p>
              <p>
                Under no circumstances will Einstein AI be liable for any loss
                or damage caused by your reliance on information obtained
                through the Services or caused by the user's conduct. Einstein
                AI does not assume any responsibility for errors or omissions in
                any content or information provided within the Services.
              </p>
              <p>
                By using the Einstein AI Services, you expressly agree that your
                use of the Services is at your sole risk. You shall not hold
                Einstein AI or its licensors and suppliers, as applicable,
                liable for any damages that result from your use of the
                Services. This comprehensive limitation of liability applies to
                all damages of any kind, including (without limitation)
                compensatory, direct, indirect, or consequential damages; loss
                of data, income, or profit; loss of or damage to property; and
                claims of third parties.
              </p>
            </div>

            <div className="modal-section">
              <h3 className="modal-subheading">User Consent</h3>
              <p>
                By using our Services, you consent to the collection, use, and
                sharing of your information as described in this Privacy Policy.
                We will not use your data for any purpose without your consent.
              </p>
            </div>

            <div className="modal-section">
              <h3 className="modal-subheading">
                Changes to This Privacy Policy
              </h3>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page. You are advised to review this Privacy Policy
                periodically for any changes.
              </p>
            </div>

            <div className="modal-section">
              <h3 className="modal-subheading">Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at{" "}
                <a
                  href="mailto:coreintelligencellc@gmail.com"
                  style={{ textDecoration: "underline" }}
                >
                  coreintelligencellc@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PrivacyPolicyModal;