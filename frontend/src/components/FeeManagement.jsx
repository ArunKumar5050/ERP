import React, { useState, useEffect } from 'react';
import { AlertTriangle, DollarSign, CheckCircle, Clock, TrendingUp, Calendar, CreditCard, Download, Eye } from 'lucide-react';
import { apiClient } from '../config/api';

export default function FeeManagement() {
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeeData();
  }, []);

  const fetchFeeData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiClient.getStudentFees();
      
      if (response.success) {
        // Transform the API data to match the component's expected structure
        const transformedData = transformFeeData(response.data);
        setFeeData(transformedData);
      } else {
        setError('Failed to fetch fee data');
      }
    } catch (err) {
      console.error('Error fetching fee data:', err);
      setError('Error loading fee data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const transformFeeData = (apiData) => {
    // Extract fee summary data
    const feeSummary = apiData.feeSummary || {};
    const feeRecords = apiData.feeRecords || [];
    const pendingFees = apiData.pendingFees || [];
    
    // Calculate payment progress
    const paymentProgress = feeSummary.totalFees > 0 
      ? Math.round((feeSummary.totalPaid / feeSummary.totalFees) * 100) 
      : 0;
    
    // Transform fee breakdown data
    const feeBreakdown = feeRecords.map(record => ({
      semester: `${record.semester_no}th Semester`,
      tuition: record.tuition_fee || 0,
      hostel: record.hostel_fee || 0,
      misc: record.misc_charges || 0,
      total: record.total_amount || 0,
      status: record.status?.toLowerCase() || 'pending',
      dueDate: record.due_date ? new Date(record.due_date).toISOString().split('T')[0] : 'N/A'
    }));
    
    // Transform recent transactions data
    // For now, we'll use a simplified version since the API doesn't return detailed payment history
    const recentTransactions = [];
    
    // Extract unique semesters from fee records
    const allSemesters = [...new Set(feeRecords.map(record => record.semester_no))].length;
    
    return {
      summary: {
        totalFees: feeSummary.totalFees || 0,
        amountPaid: feeSummary.totalPaid || 0,
        pendingAmount: feeSummary.totalPending || 0,
        paymentProgress: paymentProgress,
        pendingSemesters: pendingFees.length || 0,
        allSemesters: allSemesters || 0
      },
      feeBreakdown,
      recentTransactions
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('₹', '₹');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fee data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-4">Error Loading Fee Data</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchFeeData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!feeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-2xl mb-4">No Fee Data Available</div>
          <p className="text-gray-600">Unable to load fee information.</p>
        </div>
      </div>
    );
  }

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
                You have <span className="font-bold">{formatCurrency(feeData.summary.pendingAmount)}</span> pending across {feeData.summary.pendingSemesters} semester(s). 
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
              <div className="text-3xl font-bold text-gray-900">{formatCurrency(feeData.summary.totalFees)}</div>
              <p className="text-sm text-gray-500">All {feeData.summary.allSemesters} semesters</p>
            </div>
          </div>

          {/* Amount Paid */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Amount Paid</h3>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{formatCurrency(feeData.summary.amountPaid)}</div>
              <p className="text-sm text-gray-500">{feeData.summary.paymentProgress}% of total</p>
            </div>
          </div>

          {/* Pending Amount */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Pending Amount</h3>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-red-600">{formatCurrency(feeData.summary.pendingAmount)}</div>
              <p className="text-sm text-gray-500">{feeData.summary.pendingSemesters} semester(s)</p>
            </div>
          </div>

          {/* Payment Progress */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Payment Progress</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-4">
              <div className="text-3xl font-bold text-gray-900">{feeData.summary.paymentProgress}%</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-gray-900 to-green-500 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${feeData.summary.paymentProgress}%` }}
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
                {feeData.feeBreakdown.map((fee, index) => (
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
              {(feeData.recentTransactions || []).map((transaction) => (
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