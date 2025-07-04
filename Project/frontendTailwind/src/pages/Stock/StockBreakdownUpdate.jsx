import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Header } from '../../components';
import { FiUser } from 'react-icons/fi';
import { DashTopBox, DashTopButton } from '../../components';
import { useStateContext } from '../../contexts/ContextProvider';
import Swal from 'sweetalert2';

import { FiSettings } from 'react-icons/fi';
import { Navbar, Footer, Sidebar, ThemeSettings } from '../../components';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

function StockBreakdownUpdate() {
  //useNavigate is a hook that is used to navigate to another page
  const navigate = useNavigate();
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();

  const [stockCode, setStockCode] = useState('');
  const [stockName, setStockName] = useState('');
  const [stockCategory, setStockCategory] = useState('');
  const [description, setDescription] = useState('');
  var [quantity, setQuantity] = useState('');
  const [reorderLevel, setReorderLevel] = useState('');
  const [damagedQty, setDamagedQty] = useState('');
  const [additions, setAdditions] = useState('');
  const [issues, setIssues] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  var [totalValue, setTotalValue] = useState('');
  const [firstPurchaseDate, setfirstPurchaseDate] = useState('');
  var totAdds = 0;
  var totIssues = 0;
  var quantity = 0;
  var price = 0;

  //const [supplier, setSupplier] = useState('');
  const [stockUtil, setStockUtilisation] = useState([]); //stock is the state variable and setStock is the function to update the state variable
  var [sufficientStock, setSufficientStock] = useState('');

  const { id } = useParams();

  const getStock = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/stock/${id}`)
      .then((res) => {
        setStockCode(res.data.stockCode);
        setStockName(res.data.stockName);
        setStockCategory(res.data.stockCategory);
        setDescription(res.data.description);
        setfirstPurchaseDate(res.data.firstPurchaseDate);
        setReorderLevel(res.data.reorderLevel);
        setDamagedQty(res.data.damagedQty);
        setSufficientStock(res.data.sufficientStock);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getStockUtil = async () => {
    //getStock is the function to get the data from the backend
    axios
      .get(`${process.env.REACT_APP_API_URL}/stockUtilisation`)
      .then((res) => {
        setStockUtilisation(res.data); //setStock is used to update the state variable
        console.log(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => {
    getStock();
    getStockUtil();
    const currentThemeColor = localStorage.getItem('colorMode'); // KEEP THESE LINES
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  var currentDate = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className={currentMode === 'Dark' ? 'dark' : ''}>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
            {' '}
            {/* THEME SETTINGS BUTTON */}
            <TooltipComponent content="Settings" position="Top">
              <button
                type="button"
                onClick={() => setThemeSettings(true)}
                style={{ background: currentColor, borderRadius: '50%' }}
                className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
              >
                <FiSettings />
              </button>
            </TooltipComponent>
          </div>

          {activeMenu ? ( // SIDEBAR IMPLEMENTATION
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}

          <div
            className={
              // MAIN BACKGROUND IMPLEMENTATION
              activeMenu
                ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
            }
          >
            {/* NAVBAR IMPLEMENTATION */}
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar />
            </div>

            <div>
              {themeSettings && <ThemeSettings />}
              <div>
                <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl  dark:bg-secondary-dark-bg dark:text-white ">
                  <Header category="Form" title="Update Stock Breakdown" />
                  <div className=" flex items-center justify-center">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        {
                          stockUtil
                            .filter(
                              (stockUtil) =>
                                stockUtil.type == 'Additions' &&
                                stockUtil.stockCode == stockCode &&
                                stockUtil.firstPurchaseDate ===
                                  firstPurchaseDate
                            )
                            .map((stockUtil) => {
                              totAdds += stockUtil.quantity;
                            });
                        }
                        {
                          stockUtil
                            .filter(
                              (stockUtil) =>
                                stockUtil.type === 'Issues' &&
                                stockUtil.stockCode == stockCode &&
                                stockUtil.firstPurchaseDate ===
                                  firstPurchaseDate
                            )
                            .map((stockUtil) => {
                              totIssues += stockUtil.quantity;
                            });
                        }
                        {
                          quantity = totAdds - totIssues - damagedQty;
                        }

                        var checkStock = reorderLevel - quantity;
                        if (checkStock > 0) {
                          {
                            sufficientStock = 'Need ' + checkStock.toString();
                          }
                        } else {
                          {
                            sufficientStock = 'Available';
                          }
                        }

                        const newStock = {
                          stockCode,
                          stockName,
                          stockCategory,
                          description,
                          firstPurchaseDate,
                          reorderLevel,
                          sufficientStock,
                          damagedQty,
                        };
                        // {totalValue = unitPrice * quantity}

                        // const newStockUtil = {
                        //     stockCode,
                        //     date,
                        //     type,
                        //     //supplier,
                        //     unitPrice,
                        //     quantity,
                        //     totalValue
                        // }

                        await axios
                          .put(
                            `${process.env.REACT_APP_API_URL}/stock/update/` + id,
                            newStock
                          )
                          .then((res) => {
                            Swal.fire({
                              icon: 'success',
                              title: 'Data Successfully Updated',
                              color: '#f8f9fa',
                              background: '#6c757d',
                              showConfirmButton: false,
                              timer: 2000,
                            });
                            //navigate to the stock view page
                            navigate('/StockBreakdown');
                          })
                          .catch((err) => {
                            console.log(err);
                            alert('ERROR: Could not update stock');
                            navigate('/StockBreakdownUpdate/' + id);
                          });
                      }}
                    >
                      <div className="mb-3">
                        <label htmlFor="stockCode" className="text-md">
                          Stock Code:{' '}
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-800 rounded-md bg-gray-100 focus:bg-white dark:text-black"
                          value={stockCode}
                          id="stockCode"
                          readOnly
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="stockName" className="form-label">
                          Name:{' '}
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-800 rounded-md bg-gray-100 focus:bg-white dark:text-black"
                          value={stockName}
                          id="stockName"
                          readOnly
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="category" className="form-label">
                          Category:{' '}
                        </label>
                        <input
                          type="text"
                          className="mt-1 block w-800 rounded-md bg-gray-100 focus:bg-white dark:text-black"
                          value={stockCategory}
                          id="category"
                          readOnly
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="reorderLevel" className="form-label">
                          Reorder Level:{' '}
                        </label>
                        <input
                          type="number"
                          className="mt-1 block w-800 rounded-md bg-gray-100 focus:bg-white dark:text-black"
                          id="reorder"
                          value={reorderLevel}
                          min="0"
                          onChange={(e) => {
                            setReorderLevel(e.target.value);
                          }}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="damagedQty" className="form-label">
                          Damaged Quantity:{' '}
                        </label>
                        <input
                          type="number"
                          className="mt-1 block w-800 rounded-md bg-gray-100 focus:bg-white dark:text-black"
                          id="damagedQty"
                          value={damagedQty}
                          required
                          min="0"
                          title="If the quantity is not avilable please enter 0"
                          onChange={(e) => {
                            setDamagedQty(e.target.value);
                          }}
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-red-800 text-lg text-white left-10 p-3 my-4 rounded-lg hover:bg-red-600"
                      >
                        Update
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockBreakdownUpdate;
