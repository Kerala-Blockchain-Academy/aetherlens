import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

const TxCount = () => {
  const [totalTransCount, setTotalTransCount] = useState(0);

  useEffect(() => {
    fetchTotalTrans();
  }, []);

  async function fetchTotalTrans() {
    console.log('hello');

    const response = await fetch('/api/transCount');
    console.log('hi', response);

    const trans = await response.json();
    console.log('Latest', trans);

    if (trans != null) {
      setTotalTransCount(trans);
    } else {
      console.log('Error Fetching transaction count');
    }
  }

  return (
    <>
      <div className="bg-lightsecondary rounded-lg p-6 relative w-full break-words">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-14 h-10 rounded-full flex items-center justify-center  bg-secondary text-white">
              <Icon icon="icon-park-outline:transaction-order" height={24} />
            </span>
            <h5 className="text-base opacity-70">Transaction Count</h5>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-[24px] items-end mt-2">
          <div className="xl:col-span-6 col-span-7 flex justify-center items-center">
            <h2 className="text-3xl mb-2 ml-28">{totalTransCount}</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default TxCount;
