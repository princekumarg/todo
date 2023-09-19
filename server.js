const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3000;

// Define your TODO data store (for simplicity, using an array here).
const todos = [
    {
        "id": "123",
        "title": "Play Red Dead Redemption 2",
        "description": "Really interesting game.",
        "completed": false,
        "priority": 3,
        "dueDate": "Sat Dec 10 2022 04:08:42 GMT+0000 (Coordinated Universal Time)"
    }
];

// Middleware to parse JSON request bodies.
app.use(express.json());

// Define Swagger JSDoc options.
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'TODO API',
      description: 'API for managing TODOs',
      version: '1.0.0',
    },
  },
  apis: ['./server.js'], // Specify the file that contains your Swagger definitions.
};

// Initialize Swagger JSDoc.
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI at the /swagger endpoint.
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * definitions:
 *   Todo:
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       dueDate:
 *         type: string
 *       completed:
 *         type: boolean
 *       priority:
 *         type: number
 */

/**
 * @swagger
 * /api/todo:
 *   get:
 *     summary: Get all todos
 *     responses:
 *       200:
 *         description: A list of todos
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Todo'
 */
app.get('/api/todo', (req, res) => {
  res.status(200).json(todos);
});

/**
 * @swagger
 * /api/todo/{id}:
 *   get:
 *     summary: Get a todo by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: number
 *         description: ID of the todo to retrieve
 *     responses:
 *       200:
 *         description: The todo with the specified ID
 *         schema:
 *           $ref: '#/definitions/Todo'
 *       404:
 *         description: Todo not found
 */
app.get('/api/todo/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    res.status(404).json({ message: 'Todo not found' });
  } else {
    res.status(200).json(todo);
  }
});

/**
 * @swagger
 * /api/todo:
 *   post:
 *     summary: Create a new todo
 *     parameters:
 *       - in: body
 *         name: todo
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Todo'
 *     responses:
 *       201:
 *         description: The newly created todo
 *         schema:
 *           $ref: '#/definitions/Todo'
 *       400:
 *         description: Bad request (missing title)
 */
app.post('/api/todo', (req, res) => {
  const { title, description, dueDate, completed, priority } = req.body;

  if (!title) {
    res.status(400).json({ message: 'Title is required' });
  } else {
    const id = todos.length + 1;
    const newTodo = {
      id,
      title,
      description,
      dueDate,
      completed,
      priority,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
  }
});

/**
 * @swagger
 * /api/todo/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: number
 *         description: ID of the todo to update
 *       - in: body
 *         name: todo
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Todo'
 *     responses:
 *       200:
 *         description: The updated todo
 *         schema:
 *           $ref: '#/definitions/Todo'
 *       404:
 *         description: Todo not found
 */
app.put('/api/todo/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex((t) => t.id === id);

  if (todoIndex === -1) {
    res.status(404).json({ message: 'Todo not found' });
  } else {
    const { title, description, dueDate, completed, priority } = req.body;
    const updatedTodo = {
      id,
      title,
      description,
      dueDate,
      completed,
      priority,
    };
    todos[todoIndex] = updatedTodo;
    res.status(200).json(updatedTodo);
  }
});

/**
 * @swagger
 * /api/todo/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: number
 *         description: ID of the todo to delete
 *     responses:
 *       200:
 *         description: Todo deleted
 *       404:
 *         description: Todo not found
 */
app.delete('/api/todo/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex((t) => t.id === id);

  if (todoIndex === -1) {
    res.status(404).json({ message: 'Todo not found' });
  } else {
    todos.splice(todoIndex, 1);
    res.status(200).json({ message: 'Todo deleted' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
