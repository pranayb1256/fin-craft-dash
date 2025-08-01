import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout/Layout";
import { 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Edit,
  Trash2,
  DollarSign
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Budget {
  id: number;
  category: string;
  limit: number;
  spent: number;
  period: "monthly" | "weekly";
  color: string;
}

const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: 1, category: "Food & Dining", limit: 800, spent: 520, period: "monthly", color: "bg-blue-500" },
    { id: 2, category: "Transportation", limit: 400, spent: 320, period: "monthly", color: "bg-green-500" },
    { id: 3, category: "Entertainment", limit: 300, spent: 280, period: "monthly", color: "bg-purple-500" },
    { id: 4, category: "Shopping", limit: 500, spent: 650, period: "monthly", color: "bg-red-500" },
    { id: 5, category: "Utilities", limit: 200, spent: 185, period: "monthly", color: "bg-yellow-500" },
    { id: 6, category: "Healthcare", limit: 300, spent: 120, period: "monthly", color: "bg-pink-500" },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [newBudget, setNewBudget] = useState({
    category: "",
    limit: [500],
    period: "monthly" as "monthly" | "weekly"
  });

  const categories = [
    "Food & Dining", "Transportation", "Entertainment", "Shopping", 
    "Utilities", "Healthcare", "Travel", "Education", "Fitness", "Other"
  ];

  const availableCategories = categories.filter(cat => 
    !budgets.some(budget => budget.category === cat)
  );

  const colors = [
    "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", 
    "bg-yellow-500", "bg-pink-500", "bg-indigo-500", "bg-orange-500"
  ];

  const getUsedColor = () => {
    const usedColors = budgets.map(b => b.color);
    return colors.find(color => !usedColors.includes(color)) || colors[0];
  };

  const handleAddBudget = () => {
    if (!newBudget.category || newBudget.limit[0] <= 0) {
      toast({
        title: "Error",
        description: "Please select a category and set a valid budget limit",
        variant: "destructive",
      });
      return;
    }

    const budget: Budget = {
      id: budgets.length + 1,
      category: newBudget.category,
      limit: newBudget.limit[0],
      spent: 0,
      period: newBudget.period,
      color: getUsedColor()
    };

    setBudgets([...budgets, budget]);
    setNewBudget({
      category: "",
      limit: [500],
      period: "monthly"
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Budget created",
      description: `Budget for ${newBudget.category} has been set to $${newBudget.limit[0]}`,
    });
  };

  const handleUpdateBudget = (id: number, newLimit: number) => {
    setBudgets(budgets.map(budget => 
      budget.id === id ? { ...budget, limit: newLimit } : budget
    ));
    
    toast({
      title: "Budget updated",
      description: "Budget limit has been successfully updated",
    });
  };

  const handleDeleteBudget = (id: number) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
    toast({
      title: "Budget deleted",
      description: "Budget has been removed",
    });
  };

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return { status: "over", color: "text-expense", icon: AlertTriangle };
    if (percentage >= 80) return { status: "warning", color: "text-warning", icon: AlertTriangle };
    return { status: "good", color: "text-success", icon: CheckCircle };
  };

  const getTotalBudget = () => budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const getTotalSpent = () => budgets.reduce((sum, budget) => sum + budget.spent, 0);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Budget Planner</h1>
            <p className="text-muted-foreground">Set and track spending limits for different categories</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary shadow-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Budget</DialogTitle>
                <DialogDescription>
                  Set a spending limit for a specific category
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newBudget.category} onValueChange={(value) => setNewBudget({...newBudget, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="period">Period</Label>
                  <Select value={newBudget.period} onValueChange={(value: "monthly" | "weekly") => setNewBudget({...newBudget, period: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="limit">Budget Limit: ${newBudget.limit[0]}</Label>
                  <Slider
                    value={newBudget.limit}
                    onValueChange={(value) => setNewBudget({...newBudget, limit: value})}
                    max={2000}
                    min={50}
                    step={25}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>$50</span>
                    <span>$2,000</span>
                  </div>
                </div>
                
                <Button onClick={handleAddBudget} className="w-full bg-gradient-primary">
                  Create Budget
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold">${getTotalBudget().toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-expense/20 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-expense" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">${getTotalSpent().toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-success/20 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-2xl font-bold text-success">
                    ${(getTotalBudget() - getTotalSpent()).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
            const status = getBudgetStatus(budget.spent, budget.limit);
            const StatusIcon = status.icon;
            
            return (
              <Card key={budget.id} className="relative overflow-hidden hover:shadow-card transition-all duration-300">
                <div className={`absolute top-0 left-0 w-full h-1 ${budget.color}`} />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{budget.category}</CardTitle>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteBudget(budget.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="capitalize">{budget.period} budget</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      ${budget.spent.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      of ${budget.limit.toLocaleString()}
                    </span>
                  </div>
                  
                  <Progress
                    value={percentage}
                    className={`h-3 ${
                      percentage >= 100 
                        ? "[&>div]:bg-expense" 
                        : percentage >= 80 
                        ? "[&>div]:bg-warning" 
                        : "[&>div]:bg-success"
                    }`}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <StatusIcon className={`h-4 w-4 ${status.color}`} />
                      <span className={`text-sm font-medium ${status.color}`}>
                        {percentage.toFixed(1)}% used
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ${(budget.limit - budget.spent).toLocaleString()} left
                    </span>
                  </div>
                  
                  <div className="pt-2">
                    <Label className="text-xs text-muted-foreground">
                      Adjust limit: ${budget.limit}
                    </Label>
                    <Slider
                      value={[budget.limit]}
                      onValueChange={([value]) => handleUpdateBudget(budget.id, value)}
                      max={2000}
                      min={50}
                      step={25}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {budgets.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No budgets created yet</p>
                <p className="text-muted-foreground text-center mb-4">
                  Start by creating your first budget to track your spending
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Budget
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Budget Overview */}
        {budgets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget Overview</CardTitle>
              <CardDescription>Visual breakdown of your spending categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Total Progress</span>
                  <span>{((getTotalSpent() / getTotalBudget()) * 100).toFixed(1)}% of budget used</span>
                </div>
                <Progress 
                  value={(getTotalSpent() / getTotalBudget()) * 100} 
                  className="h-4 [&>div]:bg-gradient-primary"
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  {budgets.slice(0, 4).map((budget) => (
                    <div key={budget.id} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${budget.color}`} />
                      <div className="text-sm">
                        <p className="font-medium">{budget.category}</p>
                        <p className="text-muted-foreground">
                          ${budget.spent}/${budget.limit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Budgets;