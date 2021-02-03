// URL to send 'POST' Request
let baseURL = "https://onlinetools.ups.com/ship/v1801/rating/Shop";

// Weight Variables
let eyeNetWeight = 2;
let eyeNVSWeight = 10;
let eyeConvertWeight = 12;
let accessoriesWeight = 1;

// Weight Variables toString() Method for Object values
let eyeNetStr = '';
let eyeNVSStr = ``;
let eyeConvStr = ``;
let accessStr = ``;

// HTML elements
const rate1 = document.querySelector(".rate1");
const rate2 = document.querySelector(".rate2");
const rate3 = document.querySelector(".rate3");
const rate4 = document.querySelector(".rate4");
const rate5 = document.querySelector(".rate5");
const rate6 = document.querySelector(".rate6");
let pricing = document.querySelector(".pricing");
const address1 = document.querySelector(".address");
const city = document.querySelector(".city");
const state = document.querySelector(".state");
const postalCode = document.querySelector(".postalCode");
const submitBTN = document.querySelector(".submitBTN");
const quantity = document.querySelector(".productSelect");
const eyeNet = document.querySelector(".eyenet");
const nvs = document.querySelector(".nvs");
const eyeconvert = document.querySelector(".eyeconvert");
const accessories = document.querySelector(".access");
const selectDrop = document.querySelector(".select");

// Weight Calculation
const finalWeight = function(){
  if (selectDrop.value === eyeNet.value) {
    eyeNetWeight = eyeNetWeight * quantity.value;
    eyeNetStr = eyeNetWeight.toString();
    address.RateRequest.Shipment.ShipmentTotalWeight.Weight = eyeNetStr;
    address.RateRequest.Shipment.Package.PackageWeight.Weight = eyeNetStr;
    return;
  } else if (selectDrop.value === nvs.value) {
    eyeNVSWeight = eyeNVSWeight * quantity.value;
    eyeNVSStr = eyeNVSWeight.toString();
    address.RateRequest.Shipment.ShipmentTotalWeight.Weight = eyeNVSStr;
    address.RateRequest.Shipment.Package.PackageWeight.Weight = eyeNVSStr;
    return
  } else if (selectDrop.value === eyeconvert.value) {
    eyeConvertWeight = eyeConvertWeight * quantity.value;
    eyeConvStr = eyeConvertWeight.toString();
    address.RateRequest.Shipment.ShipmentTotalWeight.Weight = eyeConvStr;
    address.RateRequest.Shipment.Package.PackageWeight.Weight = eyeConvStr;
    return
  } else {
    accessoriesWeight = accessoriesWeight * quantity.value;
    accessStr = accessoriesWeight.toString();
    address.RateRequest.Shipment.ShipmentTotalWeight.Weight = accessStr;
    address.RateRequest.Shipment.Package.PackageWeight.Weight = accessStr;
    return
  }
}
pricing.hidden = true;

// fetch Request
let upsRequest = async function () {
  let response = await fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "AccessLicenseNumber": "", // UPS API Key Here
    },
    body: JSON.stringify(address),
  });
  let result = await response.json();
  console.log(result);
  let rateResult = result.RateResponse.RatedShipment;

  // Loop to pull Service Codes and list pricing per service code.
  rateResult.forEach(function (element) {
    if (element.Service.Code === "12") {
      rate6.innerHTML = `3 Day Transit: $${element.TotalCharges.MonetaryValue}`;
    } else if (element.Service.Code === "02") {
      rate3.innerHTML = `2 Day Transit: $${element.TotalCharges.MonetaryValue}`;
    } else if (element.Service.Code === "03") {
      rate4.innerHTML = `Ground Transit: $${element.TotalCharges.MonetaryValue}`;
    } else if (element.Service.Code === "14") {
      rate1.innerHTML = `1 Day AM Transit: $${element.TotalCharges.MonetaryValue}`;
    } else if (element.Service.Code === "01") {
      rate2.innerHTML = `1 Day Regular $${element.TotalCharges.MonetaryValue}`;
    }
  });
  return result;
};

// Event Listener
submitBTN.addEventListener("click", function (ev) {
  ev.preventDefault();

  // Updating Address Object ShipTo Address 
  let addressObject = address.RateRequest.Shipment.ShipTo.Address;
  addressObject.AddressLine = address1.value;
  addressObject.City = city.value;
  addressObject.StateProvinceCode = state.value;
  addressObject.PostalCode = postalCode.value;

  // Weight Calculation based on product selection
  finalWeight();
  // Test 
  console.log(`Weight of this package is ${address.RateRequest.Shipment.ShipmentTotalWeight.Weight}`)

  // Box Dimension Calculation based on product selection 
  // dimsFN();

  // API Call
  upsRequest();
  pricing.hidden = false;
});

// UPS API Object 
let address = {
  "UPSSecurity": {
    "UsernameToken": {
      "Username": "", // Add UPS Login Here
      "Password": "", // ^
    },
    "ServiceAccessToken": {
      "AccessLicenseNumber": "", // UPS API Key
    },
  },
  "RateRequest": {
    "Request": {
      "SubVersion": "1703",
      "TransactionReference": {
        "CustomerContext": " ",
      },
    },
    "Shipment": {
      "ShipmentRatingOptions": {
        "UserLevelDiscountIndicator": "TRUE",
      },
      "Shipper": { // Ship From Address
        "Name": "",
        "ShipperNumber": "", // Account Number
        "Address": {
          "AddressLine": "",
          "City": "",
          "StateProvinceCode": "",
          "PostalCode": "",
          "CountryCode": "US",
        },
      },
      "ShipTo": {
        "Name": "TEST",
        "Address": {
          "AddressLine": `${address1}`,
          "City": `${city}`,
          "StateProvinceCode": `${state}`,
          "PostalCode": `${postalCode}`,
          "CountryCode": "US",
        },
      },
      "ShipFrom": { // Ship From Address
        "Name": "",
        "Address": {
          "AddressLine": "",
          "City": "",
          "StateProvinceCode": "",
          "PostalCode": "",
          "CountryCode": "US",
        },
      },
      "Service": {
        "Code": "03",
        "Description": "Ground",
      },
      "ShipmentTotalWeight": {
        "UnitOfMeasurement": {
          "Code": "LBS",
          "Description": "Pounds",
        },
        "Weight": ``,
      },
      "Package": {
        "PackagingType": {
          "Code": "02",
          "Description": "Package",
        },
        "Dimensions": {
          "UnitOfMeasurement": {
            "Code": "IN",
          },
          "Length": `12`,
          "Width": `9`,
          "Height": `5`,
        },
        "PackageWeight": {
          "UnitOfMeasurement": {
            "Code": "LBS",
          },
          "Weight": ``,
        },
      },
    },
  },
};