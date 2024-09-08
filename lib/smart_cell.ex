defmodule KinoPython.SmartCell do
  use Kino.JS, assets_path: "assets/build"
  use Kino.JS.Live
  use Kino.SmartCell, name: "Python"

  @impl true
  def init(attrs, ctx) do
    source = attrs["source"] || ""
    return_values = attrs["return_values"] || ""

    {:ok, assign(ctx, source: source, fields: %{return_values: return_values}),
     editor: [source: source, language: "python"]}
  end

  @impl true
  def handle_connect(ctx) do
    {:ok, %{fields: ctx.assigns.fields}, ctx}
  end

  @impl true
  def handle_editor_change(source, ctx) do
    {:ok, assign(ctx, source: source)}
  end

  @impl true
  def to_attrs(ctx) do
    ctx.assigns
  end

  @impl true
  def to_source(attrs) do
    returns =
      attrs.fields.return_values
      |> String.split(",")
      |> Enum.map(fn val ->
        val
        |> String.trim()
        |> String.to_atom()
      end)

    quote do
      import Pythonx
      pyeval(unquote(attrs.source), return: unquote(returns))
      Keyword.take(binding(), unquote(returns))
    end
    |> Kino.SmartCell.quoted_to_string()
  end

  @impl true
  def handle_event("update_field", %{"field" => "return_values", "value" => return_values}, ctx) do
    fields =
      %{return_values: return_values}

    ctx = assign(ctx, fields: fields)

    broadcast_event(ctx, "update", %{"fields" => fields})

    {:noreply, ctx}
  end
end
