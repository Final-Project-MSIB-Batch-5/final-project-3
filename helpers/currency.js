const formatToRupiah = (balance) => {
  const rupiahFormat = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(balance);

  return rupiahFormat;
};

module.exports = { formatToRupiah };
