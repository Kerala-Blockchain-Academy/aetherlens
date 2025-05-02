import { Sidebar } from 'flowbite-react';
import SidebarContent from './Sidebaritems';
import NavItems from './NavItems';
import SimpleBar from 'simplebar-react';
import React from 'react';
import NavCollapse from './NavCollapse';

const SidebarLayout = () => {
  return (
    <>
      <div className="xl:block hidden">
        <Sidebar
          className="fixed menu-sidebar  bg-white dark:bg-darkgray rtl:pe-4 rtl:ps-0 top-[69px]"
          aria-label="Sidebar with multi-level dropdown example"
        >
          <div className="px-6 py-4 flex items-center sidebarlogo">
            {/* <h1 className="text-4xl font-bold font-montserrat text-gray-800">
              AetherLens
            </h1> */}
            <h1 className="text-3xl font-bold">
              <span className="text-indigo-600">Aether</span>
              <span className="text-rose-400">Lens</span>
            </h1>
          </div>
          <SimpleBar className="h-[calc(100vh_-_294px)]">
            <Sidebar.Items className="px-5 mt-2">
              <Sidebar.ItemGroup className="sidebar-nav hide-menu">
                {SidebarContent &&
                  SidebarContent?.map((item, index) => (
                    <div className="caption" key={item.heading}>
                      <React.Fragment key={index}>
                        <h5 className="text-link dark:text-white/70 caption font-semibold leading-6 tracking-widest text-xs pb-2 uppercase">
                          {item.heading}
                        </h5>
                        {item.children?.map((child, index) => (
                          <React.Fragment key={child.id && index}>
                            {child.children ? (
                              <div className="collpase-items">
                                <NavCollapse item={child} />
                              </div>
                            ) : (
                              <NavItems item={child} />
                            )}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    </div>
                  ))}
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </SimpleBar>
        </Sidebar>
      </div>
    </>
  );
};

export default SidebarLayout;
