import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Header } from '../../components';
import { useStateContext } from '../../contexts/ContextProvider';
import TableData from '../../components/Table/TableData';
import TableHeader from '../../components/Table/TableHeader';
import { jsPDF } from 'jspdf';
import logo from '../../data/logo.svg';
import Swal from 'sweetalert2';

import { FiSettings } from 'react-icons/fi';
import { Navbar, Footer, Sidebar, ThemeSettings } from '../../components';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { DashTopBox, DashTopButton } from '../../components';

function WorkInProgressReport() {
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();

  const [stock, setStock] = useState([]); //stock is the state variable and setStock is the function to update the state variable
  const [stockUtil, setStockUtil] = useState([]);
  var totWIP = 0;
  var price = 0;

  const getStock = async () => {
    //getStock is the function to get the data from the backend
    axios
      .get(`${process.env.REACT_APP_API_URL}/stock`)
      .then((res) => {
        setStock(res.data); //setStock is used to update the state variable
        console.log(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const getStockUtil = async () => {
    //getStock is the function to get the data from the backend
    axios
      .get(`${process.env.REACT_APP_API_URL}/stockUtilisation`)
      .then((res) => {
        setStockUtil(res.data); //setStock is used to update the state variable
        console.log(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => {
    //useEffect is used to call the function getStock
    getStock();
    getStockUtil();
    const currentThemeColor = localStorage.getItem('colorMode'); // KEEP THESE LINES
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  const createPDF = async () => {
    const date = new Date().toISOString().split('T')[0];
    const pdf = new jsPDF('landscape', 'px', 'a1', false);
    const data = await document.querySelector('#tblPDF');
    pdf.html(data).then(() => {
      pdf.save('WorkInProgress_' + date + '.pdf');
    });
  };

  const downloadConf = () => {
    Swal.fire({
      title: 'Downloading!',
      text: 'Your download has begun!',
      icon: 'success',
      showCancelButton: false,
      color: '#f8f9fa',
      background: '#6c757d',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK!',
    });
  };

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    currencyDisplay: 'symbol',
  });

  //getDAte
  const current = new Date();
  const currentdate = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;

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
                <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl dark:bg-secondary-dark-bg dark:text-white">
                  <Header
                    category="Table"
                    title="Work in Progress Report Preview"
                  />

                  <div className=" flex items-center mb-5 ">
                    <div className="mr-0 ml-auto">
                      <button
                        onClick={() => {
                          createPDF();
                          downloadConf();
                        }}
                        type="button"
                        className="py-1 px-4 rounded-lg text-white hover:bg-slate-700 bg-slate-500"
                      >
                        Download
                      </button>
                    </div>
                  </div>

                  <div id="tblPDF">
                    <div className="block w-full overflow-x-auto rounded-lg">
                      <div className="flex flex-wrap lg:flex-nowrap justify-center mt-5">
                        <img
                          className="h-200 w-400 mb-5"
                          src={logo}
                          alt="logo"
                        />
                      </div>

                      <div className="text-center mb-10">
                        <p className="text-xl mt-2">
                          Delkart Pvt Ltd,
                        </p>
                        <p className="text-xl">No.124, Hendala, Wattala</p>
                        <p>011 2942 672</p>
                      </div>
                      <p className="text-right text-xl mt-2 mb-3">
                        Generated On : {currentdate}
                      </p>

                      <table className="w-full rounded-lg">
                        <thead>
                          <tr className="bg-slate-200 text-md h-12 dark:bg-slate-800">
                            <TableHeader value="Code" />
                            <TableHeader value="Bundle Name" />
                            <TableHeader value="Category" />
                            <TableHeader value="Initial Purchase" />
                            <TableHeader value="Units" />
                            <TableHeader value="Unit price" />
                            <TableHeader value="Total value" />
                          </tr>
                        </thead>
                        <tbody>
                          {stock
                            .filter(
                              (data) =>
                                data.stockCategory === 'Work in progress'
                            )
                            .map((data) => {
                              //map is used to iterate the array
                              const date = new Date(data.firstPurchaseDate)
                                .toISOString()
                                .split('T')[0];

                              var totAdds = 0;
                              var totIssues = 0;
                              var quantity = 0;
                              var totalValue = 0;

                              {
                                stockUtil
                                  .filter(
                                    (stockUtil) =>
                                      stockUtil.type == 'Additions' &&
                                      stockUtil.stockCode == data.stockCode &&
                                      stockUtil.firstPurchaseDate ===
                                        data.firstPurchaseDate
                                  )
                                  .map((stockUtil) => {
                                    totAdds += stockUtil.quantity;
                                    totWIP += parseFloat(
                                      stockUtil.quantity * stockUtil.unitPrice
                                    );
                                    price = stockUtil.unitPrice;
                                  });
                              }
                              {
                                stockUtil
                                  .filter(
                                    (stockUtil) =>
                                      stockUtil.type === 'Issues' &&
                                      stockUtil.stockCode == data.stockCode &&
                                      stockUtil.firstPurchaseDate ===
                                        data.firstPurchaseDate
                                  )
                                  .map((stockUtil) => {
                                    totIssues += stockUtil.quantity;
                                    totWIP -= parseFloat(
                                      stockUtil.quantity * stockUtil.unitPrice
                                    );
                                  });
                              }

                              {
                                quantity =
                                  totAdds - totIssues - data.damagedQty;
                              }
                              {
                                totalValue = price * quantity;
                              }

                              if (quantity < 0) {
                                {
                                  quantity = 'No usable stocks left';
                                }
                                {
                                  totalValue = 0;
                                }
                              }

                              var datacolor = null;
                              if (quantity === 'No usable stocks left') {
                                datacolor = 'text-red-600 font-bold';
                              }

                              return (
                                <tr className="text-sm h-10 border dark:border-slate-600">
                                  <TableData value={data.stockCode} />
                                  <TableData value={data.stockName} />
                                  <TableData value={data.stockCategory} />
                                  <TableData value={date} />
                                  <td
                                    className={`${datacolor} text-center px-3 align-middle border-l-0 border-r-0 text-m whitespace-nowrap p-3`}
                                  >
                                    {quantity}{' '}
                                  </td>
                                  <TableData value={formatter.format(price)} />
                                  <TableData
                                    value={formatter.format(totalValue)}
                                  />
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                      <br></br>
                      <br></br>
                      <span className="text-xs font-semibold inline-block py-2 px-2  rounded text-red-600 bg-white-200 uppercase last:mr-0 mr-1">
                        Total Work in progress : {formatter.format(totWIP)}
                      </span>
                    </div>
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

export default WorkInProgressReport;
