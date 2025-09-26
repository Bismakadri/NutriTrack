
    <script>
        // App state
        let appData = {
            foods: [],
            mealPlans: {},
            waterCount: 0,
            currentBMI: '--'
        };

        // Nutrition database
        const nutritionDB = {
            'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10 },
            'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12 },
            'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 },
            'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1 },
            'broccoli': { calories: 25, protein: 3, carbs: 5, fat: 0.3, fiber: 3, sugar: 1.5 },
            'salmon': { calories: 208, protein: 22, carbs: 0, fat: 12, fiber: 0, sugar: 0 },
            'eggs': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1 },
            'bread': { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, sugar: 5 },
            'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0, sugar: 5 },
            'orange': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, sugar: 9 }
        };

        // Meal suggestions
        const mealSuggestions = {
            breakfast: ['Oatmeal with berries', 'Scrambled eggs with toast', 'Greek yogurt parfait', 'Smoothie bowl', 'Avocado toast', 'Pancakes'],
            lunch: ['Grilled chicken salad', 'Quinoa bowl', 'Turkey wrap', 'Lentil soup', 'Salmon teriyaki', 'Mediterranean salad'],
            dinner: ['Baked salmon with vegetables', 'Chicken stir-fry', 'Grilled steak', 'Vegetable curry', 'Pasta primavera', 'Turkey meatballs']
        };

        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            initializeApp();
        });

        function initializeApp() {
            setupEventListeners();
            updateDashboard();
            displayFoods();
            displayMealPlan();
            updateWaterDisplay();
        }

        function setupEventListeners() {
            // Tab switching
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const tabName = this.dataset.tab;
                    showTab(tabName);
                });
            });

            // Dashboard buttons
            document.getElementById('addWaterBtn').addEventListener('click', addWater);
            document.getElementById('resetWaterBtn').addEventListener('click', resetWater);

            // BMI calculator buttons
            document.getElementById('calculateBMIBtn').addEventListener('click', calculateBMI);
            document.getElementById('calculateCaloriesBtn').addEventListener('click', calculateDailyCalories);

            // Food tracker buttons
            document.getElementById('addFoodBtn').addEventListener('click', addFood);
            document.getElementById('clearFoodsBtn').addEventListener('click', clearFoods);

            // Nutrition analysis button
            document.getElementById('analyzeNutritionBtn').addEventListener('click', analyzeNutrition);

            // Meal planner buttons
            document.getElementById('addMealPlanBtn').addEventListener('click', addMealPlan);
            document.getElementById('generateWeekPlanBtn').addEventListener('click', generateWeekPlan);
        }

        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Show selected tab
            document.getElementById(tabName).classList.add('active');
            document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        }

        // Water tracking
        function addWater() {
            appData.waterCount++;
            updateWaterDisplay();
            updateDashboard();
        }

        function resetWater() {
            appData.waterCount = 0;
            updateWaterDisplay();
            updateDashboard();
        }

        function updateWaterDisplay() {
            const progressPercentage = Math.min((appData.waterCount / 8) * 100, 100);
            document.getElementById('waterProgress').style.width = progressPercentage + '%';
        }

        // BMI Calculator
        function calculateBMI() {
            const height = parseFloat(document.getElementById('height').value);
            const weight = parseFloat(document.getElementById('weight').value);
            
            if (!height || !weight || height <= 0 || weight <= 0) {
                alert('Please enter valid height and weight values');
                return;
            }
            
            const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
            appData.currentBMI = bmi;
            
            let category, color;
            if (bmi < 18.5) {
                category = 'Underweight';
                color = '#17a2b8';
            } else if (bmi < 25) {
                category = 'Normal weight';
                color = '#28a745';
            } else if (bmi < 30) {
                category = 'Overweight';
                color = '#ffc107';
            } else {
                category = 'Obese';
                color = '#dc3545';
            }
            
            document.getElementById('bmiResult').innerHTML = `
                <div class="result-card" style="background: ${color}">
                    <h3>Your BMI: ${bmi}</h3>
                    <p>Category: ${category}</p>
                </div>
            `;
            
            updateDashboard();
        }

        function calculateDailyCalories() {
            const height = parseFloat(document.getElementById('height').value);
            const weight = parseFloat(document.getElementById('weight').value);
            const age = parseFloat(document.getElementById('age').value);
            const gender = document.getElementById('gender').value;
            const activity = parseFloat(document.getElementById('activity').value);
            
            if (!height || !weight || !age || !gender) {
                alert('Please fill in all fields');
                return;
            }
            
            let bmr;
            if (gender === 'male') {
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
            } else {
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
            }
            
            const dailyCalories = Math.round(bmr * activity);
            
            document.getElementById('calorieResult').innerHTML = `
                <div class="result-card">
                    <h3>Daily Calorie Needs: ${dailyCalories}</h3>
                    <p>Based on your BMR and activity level</p>
                </div>
            `;
        }

        // Food tracking
        function addFood() {
            const name = document.getElementById('foodName').value.trim();
            const calories = parseFloat(document.getElementById('foodCalories').value);
            const mealType = document.getElementById('mealType').value;
            
            if (!name || !calories || calories <= 0) {
                alert('Please enter valid food name and calories');
                return;
            }
            
            const food = {
                id: Date.now(),
                name: name,
                calories: calories,
                mealType: mealType,
                date: new Date().toDateString()
            };
            
            appData.foods.push(food);
            
            document.getElementById('foodName').value = '';
            document.getElementById('foodCalories').value = '';
            
            displayFoods();
            updateDashboard();
        }

        function removeFood(id) {
            appData.foods = appData.foods.filter(food => food.id !== id);
            displayFoods();
            updateDashboard();
        }

        function clearFoods() {
            appData.foods = [];
            displayFoods();
            updateDashboard();
        }

        function displayFoods() {
            const today = new Date().toDateString();
            const todayFoods = appData.foods.filter(food => food.date === today);
            const totalCalories = todayFoods.reduce((sum, food) => sum + food.calories, 0);
            
            const foodList = document.getElementById('foodList');
            
            if (todayFoods.length === 0) {
                foodList.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 20px;">No food items added today</p>';
            } else {
                foodList.innerHTML = todayFoods.map(food => `
                    <div class="food-item">
                        <div class="food-info">
                            <div class="food-name">${food.name}</div>
                            <div class="food-calories">${food.calories} calories • ${food.mealType}</div>
                        </div>
                        <button class="remove-btn" onclick="removeFood(${food.id})">Remove</button>
                    </div>
                `).join('');
            }
            
            document.getElementById('totalCalories').textContent = totalCalories;
        }

        // Nutrition analysis
        function analyzeNutrition() {
            const foodName = document.getElementById('analysisFood').value.trim().toLowerCase();
            
            if (!foodName) {
                alert('Please enter a food item');
                return;
            }
            
            const nutrition = nutritionDB[foodName];
            
            if (!nutrition) {
                document.getElementById('nutritionResults').innerHTML = `
                    <div class="result-card" style="background: #dc3545;">
                        <h3>Food not found in database</h3>
                        <p>Try one of the available foods listed above</p>
                    </div>
                `;
                return;
            }
            
            document.getElementById('nutritionResults').innerHTML = `
                <h3 style="margin-bottom: 20px; color: #333;">Nutrition Facts for: ${foodName.toUpperCase()}</h3>
                <div class="nutrition-grid">
                    <div class="nutrition-item">
                        <div class="nutrition-value">${nutrition.calories}</div>
                        <div>Calories</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${nutrition.protein}g</div>
                        <div>Protein</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${nutrition.carbs}g</div>
                        <div>Carbs</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${nutrition.fat}g</div>
                        <div>Fat</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${nutrition.fiber}g</div>
                        <div>Fiber</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${nutrition.sugar}g</div>
                        <div>Sugar</div>
                    </div>
                </div>
            `;
        }

        // Meal planning
        function addMealPlan() {
            const day = document.getElementById('planDay').value;
            const mealType = document.getElementById('planMealType').value;
            const meal = document.getElementById('planMeal').value.trim();
            
            if (!meal) {
                alert('Please enter meal description');
                return;
            }
            
            if (!appData.mealPlans[day]) {
                appData.mealPlans[day] = {};
            }
            
            appData.mealPlans[day][mealType] = meal;
            document.getElementById('planMeal').value = '';
            
            displayMealPlan();
            updateDashboard();
        }

        function generateWeekPlan() {
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            
            days.forEach(day => {
                appData.mealPlans[day] = {};
                ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
                    const suggestions = mealSuggestions[mealType];
                    appData.mealPlans[day][mealType] = suggestions[Math.floor(Math.random() * suggestions.length)];
                });
            });
            
            displayMealPlan();
            updateDashboard();
        }

        function displayMealPlan() {
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const mealPlanElement = document.getElementById('mealPlan');
            
            if (Object.keys(appData.mealPlans).length === 0) {
                mealPlanElement.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 20px;">No meal plans created yet</p>';
                return;
            }
            
            mealPlanElement.innerHTML = days.map(day => {
                const dayPlans = appData.mealPlans[day] || {};
                return `
                    <div class="meal-plan-day">
                        <h3>${day.charAt(0).toUpperCase() + day.slice(1)}</h3>
                        <div style="margin-top: 10px;">
                            <div style="margin: 5px 0;"><strong>🌅 Breakfast:</strong> ${dayPlans.breakfast || 'Not planned'}</div>
                            <div style="margin: 5px 0;"><strong>🌞 Lunch:</strong> ${dayPlans.lunch || 'Not planned'}</div>
                            <div style="margin: 5px 0;"><strong>🌙 Dinner:</strong> ${dayPlans.dinner || 'Not planned'}</div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Dashboard updates
        function updateDashboard() {
            const today = new Date().toDateString();
            const todayFoods = appData.foods.filter(food => food.date === today);
            const todayCalories = todayFoods.reduce((sum, food) => sum + food.calories, 0);
            
            const totalMeals = Object.keys(appData.mealPlans).reduce((count, day) => {
                return count + Object.keys(appData.mealPlans[day]).length;
            }, 0);
            
            document.getElementById('todayCalories').textContent = todayCalories;
            document.getElementById('currentBMI').textContent = appData.currentBMI;
            document.getElementById('mealsPlanned').textContent = totalMeals;
            document.getElementById('waterIntake').textContent = appData.waterCount;
        }
    </script>