import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const RAZORPAY_API_KEY = process.env.REACT_APP_RAZORPAY_API_KEY;
const RAZORPAY_APT_SECRET = process.env.REACT_APP_RAZORPAY_APT_SECRET;


export const subscriptionPlan = async (token) => {
  const packageDetail = await axios.get(
    `${BASE_API_URL}employer-details/get-employer`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (packageDetail?.data?.result === true) {

    const result = packageDetail.data.employer_detail.subscriptionDetail;

    return result;
  }
};

// Buy Subscription
export const buySubscription = async (packageId, token, price) => {
  const data = await axios.post(
    `${BASE_API_URL}master-package-detail/package/id`,
    { packageId }
  );
  const packageValidity = await axios.get(
    `${BASE_API_URL}master-package/packageId/${packageId}`
  );

  const extractedObject = data.data.data.packagedetails.reduce((acc, curr) => {
    acc[curr.featureName] = curr.value;
    return acc;
  }, {});

  const {
    "Job Posts": jobPost,
    "Number of Sub Users": subUser,
    "Profile View Contact Details": profileViewContactDetails,
    "Profile Views": profileViews,
    "Characters in Job Description": jobDescription,
    "Download CV": downloadCv,
  } = extractedObject;

  const options = {
    key: RAZORPAY_API_KEY,
    amount: Number(price * 100),
    name: "Hirex",
    description: "Payment for Subscription Plan",
    currency: "INR",
    callback_url: "",
    handler: async () => {
      const timestamp = Date.now();
      const randomNumber = Math.floor(Math.random() * 1000000);
      const receipt = `${timestamp}_${randomNumber}`;
      const orderUrl = `${BASE_API_URL}employer-details/create-payment`;
      let bodyData = {
        amount: Number(price),
        currency: "INR",
        receipt: receipt,
        payment_capture: "1",
        keyId: RAZORPAY_API_KEY,
        keySecret: RAZORPAY_APT_SECRET,
        packageId,
        jobPost,
        subUser,
        profileViewContactDetails,
        profileViews,
        jobDescription,
        downloadCv,
        validityDays: packageValidity.data.validity,
      };
      await axios.post(orderUrl, bodyData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#E4566E",
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
