import "./styles.css";
import { RxBuilder, singleton, useService } from "react-rxbuilder";
import { Button, Input, Space } from "antd";

class Todo {
  id: string;
  isEdit = false;
  constructor(public text: string) {
    this.id = (Date.now() / Math.random()).toString();
  }
}

class TodoService {
  constructor() {
    return singleton(this);
  }

  curText = "";
  setText(t: string) {
    this.curText = t;
  }

  addTodo() {
    if (this.curText.trim()) this.todos.push(new Todo(this.curText));
    this.curText = "";
  }

  delTodo(id: string) {
    const i = this.todos.findIndex((e) => e.id === id);
    this.todos.splice(i, 1);
  }

  todos: Todo[] = [];
}

export function TestPage() {
  const { service, service$ } = useService(new TodoService());
  return (
    <div className="App">
      <RxBuilder stream={service$}>
        {(snap) => {
          if (!snap.hasData) return null;

          return (
            <div>
              <Space>
                <Input
                  type="text"
                  value={service.curText}
                  onChange={(e) => service.setText(e.target.value)}
                />
                <Button type="primary" onClick={service.addTodo}>
                  Add
                </Button>
              </Space>
              {service.todos.map((it) => {
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
                    <Button type="link" onClick={() => service.delTodo(it.id)}>
                      Del
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => (it.isEdit = !it.isEdit)}
                    >
                      {it.isEdit ? "Cancel" : "Edit"}
                    </Button>
                  </Space>
                );
              })}
            </div>
          );
        }}
      </RxBuilder>
    </div>
  );
}
