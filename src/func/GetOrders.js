export const getAllOrders = async () => {
  const get = await fetch(
    "http://127.0.0.1/eltwin_orders/api/api.php?type=getAllOrders"
  );
  const res = await get.json();
  return res;
};
