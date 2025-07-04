import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Header } from '../../components';
import { useStateContext } from '../../contexts/ContextProvider';
import TableData from '../../components/Table/TableData';
import TableHeader from '../../components/Table/TableHeader';
import { DashTopBox, DashTopButton } from '../../components';
import { FiSettings } from 'react-icons/fi';
import { Navbar, Footer, Sidebar, ThemeSettings } from '../../components';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { jsPDF } from 'jspdf';

function PendingStockPDf() {
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();

  const [pendingStock, setPendingStock] = useState([]); //stock is the state variable and setStock is the function to update the state variable
  const [searchTerm, setSearchTerm] = useState('');

  const getPendingStock = async () => {
    //getStock is the function to get the data from the backend
    axios
      .get(`${process.env.REACT_APP_API_URL}/pendingStock`)
      .then((res) => {
        setPendingStock(res.data); //setStock is used to update the state variable
        console.log(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  useEffect(() => {
    //useEffect is used to call the function getStock
    getPendingStock();
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
      pdf.save('stocks_' + date + '.pdf');
    });
  };

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
                  <Header category="Table" title="Preview" />

                  <div className=" flex items-center mb-5 ">
                    <div className="mr-0 ml-auto">
                      <button
                        onClick={createPDF}
                        type="button"
                        className="py-1 px-4 rounded-lg text-white hover:bg-slate-700 bg-slate-500"
                      >
                        Download
                      </button>
                    </div>
                  </div>

                  <div
                    id="tblPDF"
                    className="block w-full overflow-x-auto rounded-lg"
                  >
                    <table className="w-full rounded-lg">
                      <thead>
                        <tr className="bg-slate-200 text-md h-12 dark:bg-slate-800">
                          <TableHeader value="Code" />
                          <TableHeader value="Bundle Name" />
                          <TableHeader value="Category" />
                          <TableHeader value="Description" />
                          <TableHeader value="Units" />
                          <TableHeader value="Status" />
                          <TableHeader value="Manage" />
                        </tr>
                      </thead>
                      <tbody>
                        {pendingStock.map((data, key) => {
                          //map is used to iterate the array

                          var datacolor = 'text-black';
                          if (data.status === 'Resolved') {
                            datacolor = 'text-red-600 font-bold';
                          } else if (data.status === 'Resolved') {
                            datacolor = 'text-green-500 font-bold';
                          } else {
                            datacolor = '#facc15';
                          }
                          return (
                            <tr className="text-sm h-10 border dark:border-slate-600">
                              <TableData value={data.stockCode} />
                              <TableData value={data.stockName} />
                              <TableData value={data.stockCategory} />
                              <td
                                className={
                                  'text-center px-3 align-middle border-l-0 border-r-0 text-m whitespace-nowrap p-3'
                                }
                              >
                                {data.description}
                              </td>
                              <TableData value={data.date.split('T')[0]} />
                              <TableData value={data.quantity} />
                              <td
                                className={`${datacolor} text-center px-3 align-middle border-l-0 border-r-0 text-m whitespace-nowrap p-3`}
                              >
                                {data.status}{' '}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
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

export default PendingStockPDf;
