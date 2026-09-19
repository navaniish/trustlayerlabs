import React from 'react';
import { Client } from '../types';

interface ClientInformationProps {
  client: Client;
}

export const ClientInformation: React.FC<ClientInformationProps> = ({ client }) => {
  const addressFormatted = [
    client.billingAddress?.line1,
    client.billingAddress?.line2,
    client.billingAddress?.city,
    client.billingAddress?.state,
    client.billingAddress?.pin,
    client.billingAddress?.country,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="rounded-sm border-2 border-slate-900 overflow-hidden bg-white shadow-xs">
      <div className="bg-slate-900 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider">
        CLIENT INFORMATION
      </div>

      <div className="p-3 space-y-1 text-[9.5px]">
        <div className="grid grid-cols-12 border-b border-slate-100 pb-1">
          <span className="col-span-4 font-bold text-slate-700">Company Name</span>
          <span className="col-span-1 font-bold text-slate-400">:</span>
          <span className="col-span-7 font-bold text-slate-900">{client.companyName}</span>
        </div>

        <div className="grid grid-cols-12 border-b border-slate-100 py-1">
          <span className="col-span-4 font-bold text-slate-700">Contact Person</span>
          <span className="col-span-1 font-bold text-slate-400">:</span>
          <span className="col-span-7 font-semibold text-slate-800">{client.contactPerson}</span>
        </div>

        <div className="grid grid-cols-12 border-b border-slate-100 py-1">
          <span className="col-span-4 font-bold text-slate-700">Designation</span>
          <span className="col-span-1 font-bold text-slate-400">:</span>
          <span className="col-span-7 text-slate-700">{client.designation || 'Authorized Representative'}</span>
        </div>

        <div className="grid grid-cols-12 border-b border-slate-100 py-1">
          <span className="col-span-4 font-bold text-slate-700">Email</span>
          <span className="col-span-1 font-bold text-slate-400">:</span>
          <span className="col-span-7 font-medium text-blue-600">{client.email}</span>
        </div>

        <div className="grid grid-cols-12 border-b border-slate-100 py-1">
          <span className="col-span-4 font-bold text-slate-700">Phone</span>
          <span className="col-span-1 font-bold text-slate-400">:</span>
          <span className="col-span-7 text-slate-800">{client.phone}</span>
        </div>

        <div className="grid grid-cols-12 pt-1">
          <span className="col-span-4 font-bold text-slate-700">Address</span>
          <span className="col-span-1 font-bold text-slate-400">:</span>
          <span className="col-span-7 text-slate-700 leading-tight">
            {addressFormatted || 'Address not specified'}
          </span>
        </div>
      </div>
    </div>
  );
};
