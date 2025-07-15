import { FC } from 'react';
import { Outlet } from 'react-router';
// import ScrollToTop from 'src/components/shared/ScrollToTop';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';

const FullLayout: FC = () => {
  return (
    <>
      <div className="flex w-full min-h-screen dark:bg-darkgray">
        <div className="page-wrapper flex w-full  ">
          {/* Header/sidebar */}
          <Sidebar />
          <div className="page-wrapper-sub flex flex-col w-full dark:bg-darkgray">
            {/* Top Header  */}
            <Header />

            <div className={`bg-lightgray dark:bg-dark  h-full`}>
              {/* Body Content  */}
              {/* <div className={`w-full`}>
                <ScrollToTop>
                  <div className="container py-30">
                    <Outlet />
                  </div>
                </ScrollToTop>
              </div> */}
                   <div className="flex-1 min-h-[90vh] px-4 md:p-6 lg:p-8 overflow-auto">
        <Outlet />
      </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FullLayout;
