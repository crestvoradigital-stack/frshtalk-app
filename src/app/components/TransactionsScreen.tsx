import { useState } from 'react';
import { ArrowLeft, Heart, Phone, Video, Download } from 'lucide-react';

interface TransactionsScreenProps {
  coins: number;
  onBack: () => void;
  onAddCoins?: () => void;
}

type TransactionType = 'all' | 'payments' | 'sessions' | 'free';

interface Transaction {
  id: string;
  date: string;
  time: string;
  type: 'payment' | 'session' | 'free';
  sessionType?: 'audio' | 'video';
  description: string;
  amount: number;
  sessionId?: string;
  transactionId?: string;
  hasInvoice?: boolean;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: 'Mar 14',
    time: '',
    type: 'free',
    description: 'Free Wallet Recharge',
    amount: 100,
    transactionId: '34381689',
  },
  {
    id: '2',
    date: 'Feb 27',
    time: '08 m',
    type: 'session',
    sessionType: 'audio',
    description: 'used for Audio session with Ramaa_0502',
    amount: -80,
    sessionId: '260360485',
  },
  {
    id: '3',
    date: 'Feb 27',
    time: '03 m',
    type: 'session',
    sessionType: 'audio',
    description: 'used for Audio session with Amala0225',
    amount: -30,
    sessionId: '260350350',
  },
  {
    id: '4',
    date: 'Feb 27',
    time: '03 m',
    type: 'session',
    sessionType: 'video',
    description: 'used for Video session with Chandrika_1610',
    amount: -180,
    sessionId: '260343711',
  },
  {
    id: '5',
    date: 'Feb 27',
    time: '01 m',
    type: 'session',
    sessionType: 'video',
    description: 'used for Video session with Shruthi_0129',
    amount: -60,
    sessionId: '260342458',
  },
  {
    id: '6',
    date: 'Feb 27',
    time: '02 m',
    type: 'session',
    sessionType: 'video',
    description: 'used for Video session with Vishalakshi_1512',
    amount: -120,
    sessionId: '260340589',
  },
  {
    id: '7',
    date: 'Feb 27',
    time: '01 m',
    type: 'session',
    sessionType: 'video',
    description: 'used for Video session with Smithasri1711',
    amount: -60,
    sessionId: '260339771',
  },
  {
    id: '8',
    date: 'Feb 27',
    time: '02 m',
    type: 'session',
    sessionType: 'video',
    description: 'used for Video session with Miduna1110',
    amount: -120,
    sessionId: '260337923',
  },
  {
    id: '9',
    date: 'Feb 27',
    time: '',
    type: 'payment',
    description: 'Wallet Recharge: ₹850',
    amount: 3950,
    transactionId: '32658582',
    hasInvoice: true,
  },
  {
    id: '10',
    date: 'Feb 20',
    time: '',
    type: 'free',
    description: 'Free Wallet Recharge',
    amount: 100,
    transactionId: '31726736',
  },
  {
    id: '11',
    date: 'Jan 25',
    time: '',
    type: 'free',
    description: 'Free Wallet Recharge',
    amount: 100,
    transactionId: '29425274',
  },
  {
    id: '12',
    date: 'Nov 26',
    time: '',
    type: 'free',
    description: 'Free Wallet Recharge',
    amount: 100,
    transactionId: '24826688',
  },
  {
    id: '13',
    date: 'Oct 30',
    time: '',
    type: 'payment',
    description: 'Wallet Recharge: ₹450',
    amount: 1150,
    transactionId: '23060696',
    hasInvoice: true,
  },
  {
    id: '14',
    date: 'Oct 30',
    time: '',
    type: 'payment',
    description: 'Wallet Recharge: ₹948',
    amount: 3200,
    transactionId: '23059004',
    hasInvoice: true,
  },
  {
    id: '15',
    date: 'Oct 24',
    time: '',
    type: 'payment',
    description: 'Wallet Recharge: ₹948',
    amount: 3000,
    transactionId: '22746498',
    hasInvoice: true,
  },
];

export function TransactionsScreen({ coins, onBack, onAddCoins }: TransactionsScreenProps) {
  const [activeFilter, setActiveFilter] = useState<TransactionType>('all');

  const filteredTransactions = mockTransactions.filter((transaction) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'payments') return transaction.type === 'payment';
    if (activeFilter === 'sessions') return transaction.type === 'session';
    if (activeFilter === 'free') return transaction.type === 'free';
    return true;
  });

  const hasTransactions = filteredTransactions.length > 0;

  return (
    <div className="h-full w-full bg-[#0d0d0d] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 flex-shrink-0">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl font-semibold flex-1 ml-4">Transactions</h1>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">$</span>
          </div>
          <span className="text-white font-medium">{coins}</span>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="px-4 pb-4 flex gap-2 flex-shrink-0">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === 'all' ? 'bg-white text-[#0d0d0d]' : 'bg-[#3a3a3a] text-white/70'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('payments')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === 'payments' ? 'bg-white text-[#0d0d0d]' : 'bg-[#3a3a3a] text-white/70'
          }`}
        >
          Payments
        </button>
        <button
          onClick={() => setActiveFilter('sessions')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === 'sessions' ? 'bg-white text-[#0d0d0d]' : 'bg-[#3a3a3a] text-white/70'
          }`}
        >
          Sessions
        </button>
        <button
          onClick={() => setActiveFilter('free')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === 'free' ? 'bg-white text-[#0d0d0d]' : 'bg-[#3a3a3a] text-white/70'
          }`}
        >
          Free Coins
        </button>
      </div>

      {/* Transactions List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {!hasTransactions ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-white text-lg font-medium mb-2">No transactions.</p>
            <p className="text-white/60 text-sm">Your transactions will be displayed here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white/60 text-xs">
                        {transaction.date}
                        {transaction.time && ` • ${transaction.time}`}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      {transaction.sessionType && (
                        <div className="flex-shrink-0 mt-0.5">
                          {transaction.sessionType === 'audio' ? (
                            <Phone className="w-4 h-4 text-white/70" />
                          ) : (
                            <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />
                          )}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          {transaction.sessionType && (
                            <span className="font-semibold">
                              {transaction.description.split(' ')[0]} {transaction.description.split(' ')[1]}{' '}
                            </span>
                          )}
                          {transaction.sessionType ? transaction.description.split(' ').slice(2).join(' ') : transaction.description}
                        </p>
                        {transaction.sessionId && <p className="text-white/40 text-xs mt-0.5">Session ID: {transaction.sessionId}</p>}
                        {transaction.transactionId && !transaction.sessionId && (
                          <p className="text-white/40 text-xs mt-0.5">Transaction ID: {transaction.transactionId}</p>
                        )}
                        {transaction.hasInvoice && (
                          <button className="flex items-center gap-1 text-purple-400 text-xs mt-1 hover:text-purple-300 transition-colors">
                            <Download className="w-3 h-3" />
                            <span>Download Invoice</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ml-4 flex-shrink-0 ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <span className="font-semibold">
                      {transaction.amount > 0 ? '+' : ''}
                      {transaction.amount}
                    </span>
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white">$</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Coins Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d] to-transparent">
        <button
          onClick={onAddCoins}
          className="w-full bg-white text-[#0d0d0d] font-semibold py-4 rounded-full hover:bg-white/90 transition-colors"
        >
          Add Coins
        </button>
      </div>
    </div>
  );
}