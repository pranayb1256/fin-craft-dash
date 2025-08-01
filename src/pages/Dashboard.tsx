import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout/Layout";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  CreditCard,
  PiggyBank,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import heroImage from "@/assets/hero-dashboard.jpg";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Balance",
      value: "$24,580.00",
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
      bg: "bg-gradient-primary"
    },
    {
      title: "Monthly Income",
      value: "$6,200.00",
      change: "+8.2%",
      isPositive: true,
      icon: TrendingUp,
      bg: "bg-gradient-success"
    },
    {
      title: "Monthly Expenses",
      value: "$3,420.00",
      change: "-5.1%",
      isPositive: false,
      icon: CreditCard,
      bg: "bg-gradient-to-br from-expense to-red-600"
    },
    {
      title: "Savings Goal",
      value: "$10,000.00",
      change: "68% complete",
      isPositive: true,
      icon: Target,
      bg: "bg-gradient-to-br from-investment to-purple-600"
    }
  ];

  const recentTransactions = [
    { id: 1, description: "Salary Payment", amount: 6200, type: "income", date: "Today" },
    { id: 2, description: "Grocery Shopping", amount: -125.50, type: "expense", date: "Yesterday" },
    { id: 3, description: "Netflix Subscription", amount: -15.99, type: "expense", date: "2 days ago" },
    { id: 4, description: "Freelance Project", amount: 850, type: "income", date: "3 days ago" },
    { id: 5, description: "Gas Station", amount: -45.20, type: "expense", date: "3 days ago" },
  ];

  const budgetAlerts = [
    { category: "Dining Out", spent: 420, budget: 400, percentage: 105 },
    { category: "Entertainment", spent: 180, budget: 200, percentage: 90 },
    { category: "Transportation", spent: 320, budget: 400, percentage: 80 },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-hero shadow-elevated">
          <div className="absolute inset-0 opacity-20">
            <img
              src={heroImage}
              alt="Dashboard Hero"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative p-8 text-white">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-2">
                Good morning! 👋
              </h1>
              <p className="text-lg opacity-90 mb-6">
                Here's your financial overview for today. You're on track to meet your savings goal this month.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  View Reports
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-card transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-sm font-medium">
                    {stat.title}
                  </CardDescription>
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      {stat.isPositive ? (
                        <ArrowUpRight className="h-4 w-4 text-success mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-expense mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.isPositive ? "text-success" : "text-expense"
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest financial activity</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === "income" 
                          ? "bg-success/20 text-success" 
                          : "bg-expense/20 text-expense"
                      }`}>
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className={`font-bold ${
                      transaction.type === "income" ? "text-success" : "text-expense"
                    }`}>
                      {transaction.type === "income" ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Budget Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
                Budget Alerts
              </CardTitle>
              <CardDescription>Monitor your spending categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetAlerts.map((alert, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{alert.category}</span>
                      <span className="text-sm text-muted-foreground">
                        ${alert.spent}/${alert.budget}
                      </span>
                    </div>
                    <Progress
                      value={alert.percentage}
                      className={`h-2 ${
                        alert.percentage > 100 
                          ? "[&>div]:bg-expense" 
                          : alert.percentage > 80 
                          ? "[&>div]:bg-warning" 
                          : "[&>div]:bg-success"
                      }`}
                    />
                    <div className="text-xs text-muted-foreground">
                      {alert.percentage}% of budget used
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Savings Goal Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <PiggyBank className="h-5 w-5 mr-2 text-savings" />
                  Savings Goal Progress
                </CardTitle>
                <CardDescription>Emergency Fund - Target: $10,000</CardDescription>
              </div>
              <Button variant="outline">
                Adjust Goal
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">$6,800</span>
                <span className="text-sm text-muted-foreground">68% complete</span>
              </div>
              <Progress value={68} className="h-4 [&>div]:bg-gradient-primary" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>$0</span>
                <span>$3,200 remaining</span>
                <span>$10,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;