<template>
    <div class="interactive-quiz">
      <h3 class="quiz-title">{{ title }}</h3>
      <form @submit.prevent="submitAnswer">
        <div v-for="(option, index) in options" :key="index" class="quiz-option">
          <label>
            <input
              type="radio"
              :name="quizId"
              :value="option.value"
              :checked="selectedAnswer === option.value"
              @change="updateSelectedAnswer(option.value)"
            />
            <span>{{ option.label }}</span>
          </label>
        </div>
        <button type="submit" class="quiz-submit-button">提交答案</button>
      </form>
      <div v-if="submitted" class="quiz-feedback" :class="{ 'correct-animation': isCorrect }">
        <p :class="{'correct': isCorrect, 'incorrect': !isCorrect}">
          {{ feedbackMessage }}
          <span v-if="!isCorrect && showCorrectAnswer">正确答案是: {{ correctAnswer }}</span>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const props = defineProps({
    title: String,
    options: Array,
    correctAnswer: String,
    quizId: String,
    showCorrectAnswer: {
      type: Boolean,
      default: true,
    },
  });
  
  const selectedAnswer = ref('');
  const submitted = ref(false);
  const isCorrect = ref(false);
  const feedbackMessage = computed(() => {
    if (submitted.value) {
      return isCorrect.value ? '回答正确！' : '回答错误。';
    }
    return '';
  });
  
  const updateSelectedAnswer = (answer) => {
    selectedAnswer.value = answer;
    submitted.value = false; // Reset feedback on new selection
  };
  
  const submitAnswer = () => {
    submitted.value = true;
    isCorrect.value = selectedAnswer.value === props.correctAnswer;
  };
  </script>
  
  <style scoped>
  .interactive-quiz {
    margin-bottom: 2rem;
    padding: 1.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  .quiz-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .quiz-option {
    margin-bottom: 0.75rem;
  }
  
  .quiz-option label {
    display: flex;
    align-items: center;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    background-color: #fff;
    transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
  }
  
  .quiz-option label:hover {
    background-color: #f0f0f0;
    border-color: #999;
  }
  
  .quiz-option input[type="radio"] {
    margin-right: 0.75rem;
  }
  
  .quiz-option span {
    color: #555;
  }
  
  .quiz-submit-button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.75rem 1.25rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease-in-out;
  }
  
  .quiz-submit-button:hover {
    background-color: #0056b3;
  }
  
  .quiz-feedback {
    margin-top: 1rem;
    font-weight: bold;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  
  .quiz-feedback.correct-animation {
    opacity: 1;
    animation: pulse 0.5s ease-in-out;
  }
  
  .quiz-feedback p {
    margin-bottom: 0.5rem;
  }
  
  .quiz-feedback p.correct {
    color: green;
  }
  
  .quiz-feedback p.incorrect {
    color: red;
  }
  
  .quiz-feedback span {
    font-weight: normal;
    color: #777;
    margin-left: 0.5rem;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  </style>