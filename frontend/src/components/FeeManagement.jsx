import React from 'react';
import { AlertTriangle, DollarSign, CheckCircle, Clock, TrendingUp, Calendar, CreditCard, Download, Eye } from 'lucide-react';

export default function FeeManagement() {
  const feeData = {
    totalFees: 540000,
    amountPaid: 410000,
    pendingAmount: 130000,
    paymentProgress: 76,
    pendingSemesters: 2,
    allSemesters: 8
  };

  const feeBreakdown = [
    { semester: '1st Semester', tuition: 65000, hostel: 15000, misc: 5000, total: 85000, status: 'paid', dueDate: '2022-08-15' },
    { semester: '2nd Semester', tuition: 65000, hostel: 15000, misc: 5000, total: 85000, status: 'paid', dueDate: '2023-01-15' },
    { semester: '3rd Semester', tuition: 65000, hostel: 15000, misc: 5000, total: 85000, status: 'paid', dueDate: '2023-08-15' },
    { semester: '4th Semester', tuition: 65000, hostel: 15000, misc: 5000, total: 85000, status: 'paid', dueDate: '2024-01-15' },
    { semester: '5th Semester', tuition: 65000, hostel: 15000, misc: 5000, total: 85000, status: 'pending', dueDate: '2024-08-15' },
    { semester: '6th Semester', tuition: 45000, hostel: 0, misc: 0, total: 45000, status: 'pending', dueDate: '2025-01-15' },
  ];

  const recentTransactions = [
    { id: 'TXN001', date: '2024-01-10', amount: 85000, semester: '4th Semester', method: 'Online Payment', status: 'completed' },
    { id: 'TXN002', date: '2023-08-12', amount: 85000, semester: '3rd Semester', method: 'Bank Transfer', status: 'completed' },
    { id: 'TXN003', date: '2023-01-18', amount: 85000, semester: '2nd Semester', method: 'Online Payment', status: 'completed' },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('₹', '₹');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fee Management</h1>
          <p className="text-gray-600">Manage your academic fees and payment history</p>
        </div>

        {/* Pending Payment Alert */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-red-800 font-semibold mb-1">Pending Fee Payment</h3>
              <p className="text-red-700">
                You have <span className="font-bold">{formatCurrency(feeData.pendingAmount)}</span> pending across {feeData.pendingSemesters} semester(s). 
                Please make payment before the due date to avoid late fees.
              </p>
            </div>
          </div>
        </div>

        {/* Fee Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Fees */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Total Fees</h3>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{formatCurrency(feeData.totalFees)}</div>
              <p className="text-sm text-gray-500">All {feeData.allSemesters} semesters</p>
            </div>
          </div>

          {/* Amount Paid */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Amount Paid</h3>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{formatCurrency(feeData.amountPaid)}</div>
              <p className="text-sm text-gray-500">{feeData.paymentProgress}% of total</p>
            </div>
          </div>

          {/* Pending Amount */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Pending Amount</h3>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-red-600">{formatCurrency(feeData.pendingAmount)}</div>
              <p className="text-sm text-gray-500">{feeData.pendingSemesters} semester(s)</p>
            </div>
          </div>

          {/* Payment Progress */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Payment Progress</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-4">
              <div className="text-3xl font-bold text-gray-900">{feeData.paymentProgress}%</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-gray-900 to-green-500 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${feeData.paymentProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Breakdown Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Fee Breakdown by Semester</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuition</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hostel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Misc</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feeBreakdown.map((fee, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fee.semester}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(fee.tuition)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(fee.hostel)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(fee.misc)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(fee.total)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{fee.dueDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        fee.status === 'paid' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {fee.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {fee.status === 'paid' ? (
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
                          <Download className="w-4 h-4" />
                          <span>Receipt</span>
                        </button>
                      ) : (
                        <button className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors">
                          <CreditCard className="w-4 h-4" />
                          <span>Pay Now</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{transaction.semester}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>ID: {transaction.id}</span>
                        <span>•</span>
                        <span>{transaction.date}</span>
                        <span>•</span>
                        <span>{transaction.method}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{formatCurrency(transaction.amount)}</div>
                      <div className="text-sm text-green-600 capitalize">{transaction.status}</div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="flex items-center justify-center space-x-3 bg-green-200 text-green-800 p-4 rounded-xl hover:bg-green-300 transition-colors">
            <CreditCard className="w-5 h-5" />
            <span className="font-semibold">Make Payment</span>
          </button>
          <button className="flex items-center justify-center space-x-3 bg-[#26667F] text-white p-4 rounded-xl hover:bg-[#124170] transition-colors">
            <Download className="w-5 h-5" />
            <span className="font-semibold">Download Statement</span>
          </button>
          <button className="flex items-center justify-center space-x-3 bg-gray-600 text-white p-4 rounded-xl hover:bg-gray-700 transition-colors">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Payment History</span>
          </button>
        </div>
      </div>
    </div>
  );
}