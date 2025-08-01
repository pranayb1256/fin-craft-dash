import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout/Layout";
import { 
  Plus, 
  Target, 
  Calendar, 
  TrendingUp,
  Edit,
  Trash2,
  CheckCircle,
  Clock
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Goal {
  id: number;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  priority: "high" | "medium" | "low";
  status: "active" | "completed" | "paused";
}

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: "Emergency Fund",
      description: "Build a 6-month emergency fund for financial security",
      targetAmount: 15000,
      currentAmount: 8500,
      targetDate: "2024-12-31",
      category: "Emergency",
      priority: "high",
      status: "active"
    },
    {
      id: 2,
      title: "Vacation to Japan",
      description: "Save for a 2-week trip to Japan including flights and accommodation",
      targetAmount: 5000,
      currentAmount: 2200,
      targetDate: "2024-08-15",
      category: "Travel",
      priority: "medium",
      status: "active"
    },
    {
      id: 3,
      title: "New Car Down Payment",
      description: "Save for a 20% down payment on a new car",
      targetAmount: 8000,
      currentAmount: 3200,
      targetDate: "2024-10-01",
      category: "Transportation",
      priority: "medium",
      status: "active"
    },
    {
      id: 4,
      title: "Investment Portfolio",
      description: "Start investing in index funds and build a diversified portfolio",
      targetAmount: 10000,
      currentAmount: 10000,
      targetDate: "2024-06-01",
      category: "Investment",
      priority: "high",
      status: "completed"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetAmount: "",
    targetDate: "",
    category: "Savings",
    priority: "medium" as "high" | "medium" | "low"
  });

  const categories = ["Emergency", "Travel", "Transportation", "Investment", "Housing", "Education", "Healthcare", "Other"];
  const priorities = ["high", "medium", "low"];

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.targetDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const goal: Goal = {
      id: goals.length + 1,
      title: newGoal.title,
      description: newGoal.description,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: 0,
      targetDate: newGoal.targetDate,
      category: newGoal.category,
      priority: newGoal.priority,
      status: "active"
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: "",
      description: "",
      targetAmount: "",
      targetDate: "",
      category: "Savings",
      priority: "medium"
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Goal created",
      description: `Your goal "${newGoal.title}" has been added successfully`,
    });
  };

  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
    toast({
      title: "Goal deleted",
      description: "The goal has been removed",
    });
  };

  const handleMarkComplete = (id: number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, status: "completed" as const, currentAmount: goal.targetAmount } : goal
    ));
    toast({
      title: "Congratulations!",
      description: "Goal marked as completed",
    });
  };

  const addContribution = (id: number, amount: number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { 
        ...goal, 
        currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount),
        status: goal.currentAmount + amount >= goal.targetAmount ? "completed" : goal.status
      } : goal
    ));
    toast({
      title: "Contribution added",
      description: `$${amount} added to your goal`,
    });
  };

  const getProgress = (current: number, target: number) => Math.min((current / target) * 100, 100);

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const activeGoals = goals.filter(goal => goal.status === "active");
  const completedGoals = goals.filter(goal => goal.status === "completed");

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Financial Goals</h1>
            <p className="text-muted-foreground">Track your progress towards financial milestones</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary shadow-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
                <DialogDescription>
                  Set a new financial target to work towards
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Emergency Fund"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of your goal"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target">Target Amount</Label>
                    <Input
                      id="target"
                      type="number"
                      placeholder="10000"
                      value={newGoal.targetAmount}
                      onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Target Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({...newGoal, priority: e.target.value as "high" | "medium" | "low"})}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      {priorities.map(priority => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <Button onClick={handleAddGoal} className="w-full bg-gradient-primary">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Goals</p>
                  <p className="text-2xl font-bold">{activeGoals.length}</p>
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
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedGoals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-investment/20 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-investment" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Saved</p>
                  <p className="text-2xl font-bold">
                    ${activeGoals.reduce((sum, goal) => sum + goal.currentAmount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-warning/20 rounded-lg">
                  <Calendar className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Amount</p>
                  <p className="text-2xl font-bold">
                    ${activeGoals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Goals */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Active Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeGoals.map((goal) => {
              const progress = getProgress(goal.currentAmount, goal.targetAmount);
              const daysRemaining = getDaysRemaining(goal.targetDate);
              
              return (
                <Card key={goal.id} className="relative overflow-hidden hover:shadow-card transition-all duration-300">
                  <div className={`absolute top-0 left-0 w-full h-1 ${getPriorityColor(goal.priority)}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <CardDescription>{goal.description}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary">{goal.category}</Badge>
                      <Badge variant="outline" className={`${getPriorityColor(goal.priority)} text-white`}>
                        {goal.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        ${goal.currentAmount.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        of ${goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    
                    <Progress
                      value={progress}
                      className="h-3 [&>div]:bg-gradient-primary"
                    />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{progress.toFixed(1)}% complete</span>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {daysRemaining > 0 ? `${daysRemaining} days left` : "Overdue"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => addContribution(goal.id, 100)}
                      >
                        Add $100
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => addContribution(goal.id, 500)}
                      >
                        Add $500
                      </Button>
                      {progress >= 100 && (
                        <Button 
                          size="sm" 
                          className="flex-1 bg-success hover:bg-success/90"
                          onClick={() => handleMarkComplete(goal.id)}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {activeGoals.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Target className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No active goals</p>
                  <p className="text-muted-foreground text-center mb-4">
                    Start by creating your first financial goal
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Goal
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Completed Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedGoals.map((goal) => (
                <Card key={goal.id} className="relative overflow-hidden opacity-75">
                  <div className="absolute top-0 left-0 w-full h-1 bg-success" />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          <CheckCircle className="h-5 w-5 text-success mr-2" />
                          {goal.title}
                        </CardTitle>
                        <CardDescription>{goal.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success">
                        ${goal.targetAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Goal achieved!</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Goals;