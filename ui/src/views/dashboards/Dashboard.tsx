import { Link } from "react-router"
import TxReport from "src/components/dashboard/TxReport"
import LatestBlock from "src/components/dashboard/LatestBlock"
import TxCount from "src/components/dashboard/TxCount"
import TotalContract from "src/components/dashboard/TotalContract"



const Dashboard = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
    <div className="lg:col-span-8 col-span-12">
      <TxReport/>
    </div>
    <div className="lg:col-span-4 col-span-12">
          <div className="grid grid-cols-1 ">
            <div className="col-span-12 mb-4">
              <LatestBlock />
            </div>
            <div className="col-span-12 mb-4">
              <TxCount />
            </div>
            <div className="col-span-12 ">
              <TotalContract />
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
  </div>
  )
}

export default Dashboard