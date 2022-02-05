import React, { useRef } from "react";
import { Modal } from "bootstrap";

function OrderLog({ user, order }) {
  const modalRef = useRef();

  const showModal = () => {
    const modalEle = modalRef.current;
    const bsModal = new Modal(modalEle);
    bsModal.show();
  };

  const hideModal = () => {
    const modalEle = modalRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };
  return (
    <div>
      <button className="btn btn-primary mx-4 my-2" onClick={showModal}>
        Historia zamówienia
      </button>

      <div className="modal fade" ref={modalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Historia zamówienia {order.id}</h5>
            </div>
            <div className="modal-body">
              {order.log.map((log) => {
                return (
                  <div key={log.id}>
                    <p className="fw-bold">{log.date_added}</p>
                    <p>{log.message}</p>
                    <p>
                      Przez: <b>{log.user}</b>
                    </p>
                    <hr />
                  </div>
                );
              })}
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={hideModal}>
                Zamknij
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderLog;
