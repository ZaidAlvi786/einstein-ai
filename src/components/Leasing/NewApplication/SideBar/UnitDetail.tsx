import React from 'react'
import { Home07Icon,SvgDefaultUser } from '@assets/iconComponents';


const UnitDetail = () => {
  return (
    <div className="px-8 pt-12 pb-14 bg-gradient-brand-60050090-deg relative">
            <div className="bg-white border border-solid border-[1px] border-Gray-blue-300 rounded-[12px] p-6">
              <div>
                <div className="text-Gray-900 text-base font-semibold leading-6 mb-0.5">
                  Whitestone Apartments
                </div>
                <div className="text-2xl text-Gray-900 leading-8 font-semibold">Unit 101</div>
                <div className="font-medium text-xs text-Gray-700">
                  123 Main St, #101, New York NY 11100
                </div>
              </div>
              <div className="flex items-center mt-6">
                <div> <Home07Icon className=" " /></div>
                <div className="text-sm font-semibold text-Gray-900 ms-4">
                  <div>3 bed, 1 bath, 1,200 sqft.</div>
                  <div>$2,040 market rent</div>
                </div>
              </div>
            </div>
             <SvgDefaultUser className="absolute left-3 mt-4 " />
          </div>
  )
}

export default UnitDetail