
import { useState,useEffect } from "react";
import { Link, useParams,useNavigate } from "react-router";
import { Icon } from "@iconify/react";
// import { Table } from "flowbite-react";

// import SimpleBar from "simplebar-react";


const ContractTxns = () => {
  const navigate = useNavigate()
    console.log("Hello");
    const blk = useParams();
    console.log(blk.id);

    const [txDetails, setTxDetails] = useState([])

    useEffect(() => { 
        const runSequentially = async()=>{
        await getUser()
        await TxD();
    } 
    runSequentially()
    }, []);
    async function getUser(){
    const response = await fetch("http://127.0.0.1:8080/verify",{
      credentials:'include'
    })
    console.log(response);
    

    if(response.status!=200){
      alert('Sorry!You are not allowed')
      navigate('/')
    }

    const data = await response.json();
    console.log(data);
    
  }
    async function TxD() {
      console.log("HEEELoo");
  
      let res = await fetch(`http://127.0.0.1:8080/contractTx/${blk.id}`, {
        method: "GET",
        redirect: "follow",
        credentials:'include'
      })
      console.log(res);
  
      let lblk = [];
      lblk = await res.json();
      console.log(lblk);
      setTxDetails(lblk)
    }
   

//   
  
// const [productList] = useState(lblk);
  const [rowsLimit] = useState(50);
  console.log("Rowslimit",rowsLimit);
  
  const [rowsToShow, setRowsToShow] = useState([]);
  const [customPagination, setCustomPagination] = useState<number[]>([]);

  const [totalPage] = useState(Math.ceil(txDetails?.length / rowsLimit));
  const [currentPage, setCurrentPage] = useState(0);
  console.log("rowstoshow",rowsToShow);
  
  const nextPage = () => {
    const startIndex = rowsLimit * (currentPage + 1);
    const endIndex = startIndex + rowsLimit;
    const newArray = txDetails.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(currentPage + 1);
  };
  const changePage = (value:number) => {
    const startIndex = value * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = txDetails.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(value);
  };
  const previousPage = () => {
    const startIndex = (currentPage - 1) * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = txDetails.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(0);
    }
  };
  useEffect(() => {
  setRowsToShow(txDetails.slice(0, rowsLimit));

  setCustomPagination(
    Array(Math.ceil(txDetails?.length / rowsLimit)) .fill(null) .map((_, index) => index + 1)
  );
}, [txDetails, rowsLimit]);
  useEffect(() => {

    setCustomPagination(
      Array(Math.ceil(txDetails?.length / rowsLimit)).fill(null)
    );
  }, []);


    const shortenHash = (hash:any) => {
        if (!hash) return '';
        return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
      };

      const handleCopy = async (text:any) => {
        if (document.hasFocus()) {
          try {
            await navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
          } catch (err) {
            console.error('Failed to copy:', err);
          }
        } else {
          alert('Please focus the page and try again.');
        }
      };

  return (
    <>
      <div className="rounded-lg dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray py-6 px-0 relative w-full break-words">
       

        <div className="min-h-screen h-full bg-white flex flex-col items-start justify-start pr-4 pt-4 pb-6">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div>
          <h1 className="text-2xl font-medium">
            Contract Transactions
          </h1>
          <p>Latest 500 transactions</p>
        </div>
        <div className="w-full overflow-x-scroll md:overflow-auto  max-w-7xl 2xl:max-w-none mt-2">
          <table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border ">
            <thead className="rounded-lg text-base text-white font-semibold w-full">
              <tr className="bg-[#222E3A]/[6%]">
                <th className="py-4 px-6 text-zinc-950 sm:text-base font-bold whitespace-nowrap">
                  Transaction Hash
                </th>
                <th className="py-4 px-6 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                  From
                </th>
                <th className="py-4 px-6  justify-center gap-1 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                  To
                </th>
                <th className="py-4 px-6 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                  Input Data
                </th>
                <th className="py-4 px-6 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                 Amount
                </th>
                {/* <th className="flex items-center py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap gap-1">
                  Price
                </th> */}
              </tr>
            </thead>
            <tbody>
              {rowsToShow?.map((data, index) => {
                console.log("Entered Table");
                
                const it = JSON.stringify(data)
                    const itm = JSON.parse(it)
                    console.log(itm);
             return(
                <tr
                  className={`${
                    index % 2 == 0 ? "bg-white" : "bg-[#222E3A]/[6%]"
                  }`}
                  key={index}
                >
                  <td
                    className={`py-4 px-6 text-sm font-normal text-fuchsia-900   ${
                      index == 0
                        ? "border-t-2 border-black"
                        : index == rowsToShow?.length
                        ? "border-y"
                        : "border-t"
                    } whitespace-nowrap`}
                   
                  >
                    <span className="inline-flex items-center gap-1">{shortenHash(itm.Hash)}<Icon icon="material-symbols:ad-group-sharp" onClick={() => { handleCopy(itm.Hash) }} height="18" className="text-dark" /></span>
                  </td>
                  <td
                    className={`py-4 px-6 font-normal text-fuchsia-900 text-sm whitespace-nowrap ${
                      index == 0
                        ? "border-t-2 border-black"
                        : index == rowsToShow?.length
                        ? "border-y"
                        : "border-t"
                    } whitespace-nowrap`}
          
                  >
                    <span className="inline-flex items-center gap-1">{shortenHash(itm.From)}<Icon icon="material-symbols:ad-group-sharp" onClick={() => { handleCopy(itm.From) }} height="18" className="text-dark" /></span>
                  </td>
                  <td
                    className={`py-4 px-6 font-normal text-fuchsia-900 text-sm whitespace-nowrap ${
                      index == 0
                        ? "border-t-2 border-black"
                        : index == rowsToShow?.length
                        ? "border-y"
                        : "border-t"
                    } whitespace-nowrap`}
                  
                  >
                    <span className="inline-flex items-center gap-1">{shortenHash(itm.To)}<Icon icon="material-symbols:ad-group-sharp" onClick={() => { handleCopy(itm.To) }} height="18" className="text-dark" /></span>
                  </td>
                  <td
                    className={`py-4 px-6 text-base  font-normal text-fuchsia-900 text-sm whitespace-nowrap ${
                      index == 0
                        ? "border-t-2 border-black"
                        : index == rowsToShow?.length
                        ? "border-y"
                        : "border-t"
                    } whitespace-nowrap`}
                  >
                    <Link to={`/blkTxInput/${itm.Hash}`}  className="underline decoration-solid text-cyan-500"> Click Here</Link>
                  </td>
                  <td
                    className={`py-4 px-6 text-base  font-normal text-fuchsia-900 text-sm whitespace-nowrap ${
                      index == 0
                        ? "border-t-2 border-black"
                        : index == rowsToShow?.length
                        ? "border-y"
                        : "border-t"
                    } min-w-[250px]`}
                  >
                    {itm.Value} Ethers
                  </td>
                
                </tr>
             )
              })}
            </tbody>
          </table>
        </div>
        <div className="w-full  flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-1.5 px-1 items-center">
          <div className="text-lg">
            Showing {currentPage == 0 ? 1 : currentPage * rowsLimit + 1} to{" "}
            {currentPage == totalPage - 1
              ? txDetails?.length
              : (currentPage + 1) * rowsLimit}{" "}
            of {txDetails?.length} entries
          </div>
          <div className="flex">
            <ul
              className="flex justify-center items-center gap-x-[10px] z-30"
              role="navigation"
              aria-label="Pagination"
            >
              <li
                className={` prev-btn flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] disabled] ${
                  currentPage == 0
                    ? "bg-[#cccccc] pointer-events-none"
                    : " cursor-pointer"
                }
  `}
                onClick={previousPage}
              >
                <img src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg" />
              </li>
              {customPagination?.map((_, index) => (
                <li
                  className={`flex items-center justify-center w-[36px] rounded-[6px] h-[34px] border-[1px] border-solid border-[2px] bg-[#FFFFFF] cursor-pointer ${
                    currentPage == index
                      ? "text-blue-600  border-sky-500"
                      : "border-[#E4E4EB] "
                  }`}
                  onClick={() => changePage(index)}
                  key={index}
                >
                  {index + 1}
                </li>
              ))}
              <li
                className={`flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${
                  currentPage == totalPage - 1
                    ? "bg-[#cccccc] pointer-events-none"
                    : " cursor-pointer"
                }`}
                onClick={nextPage}
              >
                <img src="https://www.tailwindtap.com/assets/travelagency-admin/rightarrow.svg" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
      </div>
      <div className="col-span-12 text-center">
      <p className="text-base">
        Design and Developed by{""}
        <Link
          to="https://kba.ai/"
          target="_blank"
          className="pl-1 text-primary underline decoration-primary"
        >
          Kerala Blockchain Academy
        </Link>
      </p>
    </div>
    </>
  );
};

export default ContractTxns;
