import { Modal } from "bootstrap";

export const showModal = (modalRef) => {
  const modalEle = modalRef.current;
  const bsModal = new Modal(modalEle);
  bsModal.show();
};

export const hideModal = (modalRef) => {
  const modalEle = modalRef.current;
  const bsModal = Modal.getInstance(modalEle);
  bsModal.hide();
};
