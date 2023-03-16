// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")


// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
function formatPhoneNumber(phoneNumber) {
    const cleanNumber = phoneNumber.replace(/-/g, '');
    const areaCode = cleanNumber.slice(0, 3);
    const middlePart = cleanNumber.slice(3, 7);
    const lastPart = cleanNumber.slice(7);
    return `${areaCode}-${middlePart}-${lastPart}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const output = document.getElementById("output");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const phoneNumber = document.getElementById("phone").value;
        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
        const status = document.querySelector('input[name="status"]:checked').value;
        const callerName = document.getElementById("callerName").value;
        const relationship = document.querySelector('input[name="relationship"]:checked').value;
        const relationshipText = relationship === "その他" ? document.getElementById("relationshipText").value : "";
        const request = document.getElementById("request").value;
        const response = document.getElementById("response").value;
        const supplement = document.querySelector('input[name="supplement"]:checked').value;
        const supplementText = supplement === "有り" ? document.getElementById("supplementText").value : "";
        const guideCheckboxes = document.querySelectorAll('input[name="guide"]:checked');
        const temperature = document.querySelector('input[name="temperature"]:checked').value;
        let guideOutput = "";
        let hasGuide = false;
        guideCheckboxes.forEach(checkbox => {
            if (checkbox.value !== "無し") {
                hasGuide = true;
            }
            if (checkbox.value === "費用負担") {
                guideOutput += "■（設備不具合時）現地訪問時に不具合が確認できない場合や入居者故意過失時の費用負担の可能性案内：了承済\n";
            } else if (checkbox.value === "情報開示") {
                guideOutput += "■（設備不具合時）業者等への情報開示許可：了承済\n";
            } else if (checkbox.value === "契約書優先") {
                guideOutput += "■（解約受付時）契約書優先となる旨案内：案内済\n";
            }
        });
        
        if (hasGuide) {
            guideOutput = "＜案内事項＞\n" + guideOutput;
        }

        let relationshipOutput = relationship === "その他" ? `（賃借人との関係性確認：${relationship}：${relationshipText}）` : `（賃借人との関係性確認：${relationship}）`;
        let supplementOutput = supplement === "有り" ? `＜対応補足事項＞\n■${supplementText}\n` : "";

        const outputText = `＜連絡先情報＞${formattedPhoneNumber}\n（住所・物件名・号室：${status} ）（入電者名：${callerName} ）${relationshipOutput}\n------------------------\n【連絡内容・要望】\n${request}\n【対応案内・回答】\n${response}\n------------------------\n${supplementOutput}\n${guideOutput}\n＜連絡者の温度感＞\n■${temperature}`;
        output.value = outputText;
    });

    document.querySelectorAll('input[name="relationship"]').forEach(radio => {
        radio.addEventListener("change", () => {
            document.getElementById("relationshipText").style.display = document.querySelector('input[name="relationship"]:checked').value === "その他" ? "inline" : "none";
        });
    });

    document.querySelectorAll('input[name="supplement"]').forEach(radio => {
        radio.addEventListener("change", () => {
            document.getElementById("supplementText").style.display = document.querySelector('input[name="supplement"]:checked').value === "有り" ? "block" : "none";
        });
    });
});
