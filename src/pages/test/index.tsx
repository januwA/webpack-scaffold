import "./styles.css";
import { Injectable, useService } from "react-rxbuilder";
import { Button, Input, Space } from "antd";

class Todo {
  id: string;
  isEdit = false;
  constructor(public text: string) {
    this.id = (Date.now() / Math.random()).toString();
  }
}

@Injectable()
class LogService {
  date() {
    console.log(new Date().toUTCString());
  }
}

@Injectable()
class TodoService {
  constructor(public log: LogService) {}
  curText = "";
  setText(t: string) {
    this.curText = t;
  }

  addTodo() {
    if (this.curText.trim()) this.todos.push(new Todo(this.curText));
    this.curText = "";
    this.log.date();
  }

  delTodo(id: string) {
    const i = this.todos.findIndex((e) => e.id === id);
    this.todos.splice(i, 1);
  }

  todos: Todo[] = [];
}

export function TestPage() {
  const [todo] = useService(TodoService);
  return (
    <div className="App">
      <Space>
        <Input
          type="text"
          value={todo.curText}
          onChange={(e) => todo.setText(e.target.value)}
        />
        <Button type="primary" onClick={todo.addTodo}>
          Add
        </Button>
      </Space>
      {todo.todos.map((it) => {
        return (
          <Space className="todo" key={it.id}>
            {it.isEdit ? (
              <Input
                type="text"
                value={it.text}
                onChange={(e) => (it.text = e.target.value)}
              />
            ) : (
              <span>{it.text}</span>
            )}
            <Button type="link" onClick={() => todo.delTodo(it.id)}>
              Del
            </Button>
            <Button type="primary" onClick={() => (it.isEdit = !it.isEdit)}>
              {it.isEdit ? "Cancel" : "Edit"}
            </Button>
          </Space>
        );
      })}
    </div>
  );
}
