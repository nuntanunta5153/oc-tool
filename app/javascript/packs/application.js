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

        let relationshipOutput = relationship === "その他" ? `（賃借人との関係性確認：${relationshipText}）` : `（賃借人との関係性確認：${relationship}）`;
        let supplementOutput = supplement === "有り" ? `＜対応補足事項＞\n■${supplementText}\n` : "";

        const outputText = `＜連絡先情報＞${formattedPhoneNumber}\n（住所・物件名・号室：${status} ）（入電者名：${callerName} ）${relationshipOutput}\n------------------------\n【連絡内容・要望】\n${request}\n\n【対応案内・回答】\n${response}\n------------------------\n${supplementOutput}\n${guideOutput}\n＜連絡者の温度感＞\n■${temperature}`;
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


// character_counter.js
document.addEventListener("DOMContentLoaded", function () {
  const inputElement = document.getElementById("input-text");
  const caseIdElement = document.getElementById("case-id");
  const destinationNumberElement = document.getElementById("destination-number");
  const statusRadios = document.getElementsByName("sendstatus");
  const handlerElement = document.getElementById("handler");
  const outputElement = document.getElementById("output-text");
  const counterElement = document.getElementById("counter");
  const tokyoBuildingRadios = document.getElementsByName("tokyo-building");

  function generateOutputText() {
    const inputText = inputElement.value;
    const caseId = caseIdElement.value;
    const destinationNumber = destinationNumberElement.value
      .replace(/-/g, "")
      .replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    const handler = handlerElement.value;
    let status = "";
    let tokyoBuilding = "";

    for (const radio of statusRadios) {
      if (radio.checked) {
        status = radio.value;
        break;
      }
    }

    for (const radio of tokyoBuildingRadios) {
      if (radio.checked) {
        tokyoBuilding = radio.value;
        break;
      }
    }

    let tokyoBuildingInfo = "";
    if (tokyoBuilding === "東京建物（無印）") {
      tokyoBuildingInfo = "東京建物不動産販売 0120-000-0000";
    } else if (tokyoBuilding === "東京建物（RM）") {
      tokyoBuildingInfo = "東京建物不動産販売 0120-111-1111";
    }

    return `＜SMS送信予定＞\n【本文】${inputText} ${tokyoBuildingInfo} ${handler}　案件ID：${caseId}\n【送信先番号】${destinationNumber}\n【送信後ステータス】${status}\n【送信後案件担当者】${handler}`;
  }

  function updateOutput() {
    const textLength = Array.from(inputElement.value).length;

    if (textLength <= 670) {
      counterElement.textContent = `${textLength} / 670`;
      outputElement.value = generateOutputText();
    } else {
      inputElement.value = Array.from(inputElement.value).slice(0, 670).join("");
    }
  }

  inputElement.addEventListener("input", updateOutput);
  caseIdElement.addEventListener("input", updateOutput);
  destinationNumberElement.addEventListener("input", updateOutput);
  handlerElement.addEventListener("input", updateOutput);

  for (const radio of statusRadios) {
    radio.addEventListener("change", updateOutput);
  }

  for (const radio of tokyoBuildingRadios) {
    radio.addEventListener("change", updateOutput);
  }

  const copyButton = document.getElementById("copy-output");
  const resetButton = document.getElementById("reset-output");

  function copyOutputText() {
    outputElement.select();
    document.execCommand("copy");
  }

  function resetOutputText() {
    inputElement.value = "";
    caseIdElement.value = "";
    destinationNumberElement.value = "";
    handlerElement.value = "";
    for (const radio of statusRadios) {
      radio.checked = false;
    }
    for (const radio of tokyoBuildingRadios) {
           radio.checked = false;
    }
    outputElement.value = "";
    counterElement.textContent = "0 / 670";
    
    handlerElement.value = localStorage.getItem("savedHandler") || "";
  }

  copyButton.addEventListener("click", copyOutputText);
  resetButton.addEventListener("click", resetOutputText);

  // LocalStorage script
  const saveButton = document.createElement("button");

  // データをLocalStorageから取得して、入力フィールドに設定
  handlerElement.value = localStorage.getItem("savedHandler") || "";

  // 保存ボタンの設定
  saveButton.textContent = "担当者情報を保存";
  saveButton.addEventListener("click", () => {
    localStorage.setItem("savedHandler", handlerElement.value);
    alert("担当者情報が保存されました");
  });

  // 保存ボタンを入力フィールドの後に挿入
  handlerElement.parentNode.insertBefore(saveButton, handlerElement.nextSibling);
});


