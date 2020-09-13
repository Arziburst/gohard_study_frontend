// Core
import { useQuery, useMutation, queryCache } from 'react-query';

// Api
import {
  fetchTodos, createTodo, updateTodo, deleteTodo,
} from './api';

const TYPE_TODOS = 'todos';

export const useTodosQuery = () => {
  return useQuery(TYPE_TODOS, fetchTodos);
};

export const useCreateTodo = () => {
  return useMutation((body) => createTodo(body), {
    onSuccess: (createdTodo) => {
      const previousTodos = queryCache.getQueryData(TYPE_TODOS);

      queryCache.setQueryData(TYPE_TODOS, () => [createdTodo, ...previousTodos]);
    },
  });
};

export const useUpdateTodo = () => {
  return useMutation((options) => updateTodo(options), {
    onSuccess: (updatedTodo) => {
      const previousTodos = queryCache.getQueryData(TYPE_TODOS);

      queryCache.setQueryData(TYPE_TODOS, () => previousTodos.map((todo) => {
        if (todo.id === updatedTodo.id) {
          return updatedTodo;
        }

        return todo;
      }));
    },
  });
};

export const useDeleteTodo = () => {
  return useMutation((todoId) => deleteTodo(todoId), {
    onSuccess: (isTodoDeleted, todoId) => {
      if (!isTodoDeleted) {
        throw new Error('Todo delete failed.');
      }

      const previousTodos = queryCache.getQueryData('todos');

      queryCache.setQueryData('todos', () => previousTodos.filter(
        (todo) => todo.id !== todoId),
      );
    },
  });
};
