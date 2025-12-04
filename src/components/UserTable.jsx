import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Popconfirm,
  Form,
  Input,
  Typography,
  Checkbox,
  Popover,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  HolderOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import SearchBar from "./SearchBar.jsx";

const { Text } = Typography;

// All column keys
const ALL_COLUMN_KEYS = [
  "id",
  "name",
  "username",
  "email",
  "phone",
  "age",
  "birthDate",
  "gender",
  "city",
  "company",
  "actions",
];

function arrayMove(arr, fromIndex, toIndex) {
  const newArr = [...arr];
  const item = newArr.splice(fromIndex, 1)[0];
  newArr.splice(toIndex, 0, item);
  return newArr;
}

function UserTable() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [loading, setLoading] = useState(false);

  // Search
  const [searchValue, setSearchValue] = useState("");

  // Column state
  const [columnsOrder, setColumnsOrder] = useState(ALL_COLUMN_KEYS);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(ALL_COLUMN_KEYS);

  // Drag state
  const [dragRowKey, setDragRowKey] = useState(null);
  const [dragColVisibleIndex, setDragColVisibleIndex] = useState(null);

  // To clear internal sorter/filter on reset
  const [tableInstanceKey, setTableInstanceKey] = useState(0);

  // Fetch data incl. birthDate
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch("https://dummyjson.com/users?limit=100");
        const json = await res.json();
        const mapped = json.users.map((u) => ({
          key: String(u.id),
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          username: u.username,
          email: u.email,
          phone: u.phone,
          age: u.age,
          birthDate: u.birthDate, 
          gender: u.gender,
          city: u.address?.city || "",
          company: u.company?.name || "",
        }));
        setData(mapped);
      } catch (e) {
        console.error("Failed to fetch users", e);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      username: "",
      email: "",
      phone: "",
      age: "",
      birthDate: "",
      city: "",
      company: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => setEditingKey("");
//   save the changes in the row
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      }
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  const handleDelete = (key) => {
    setData((prev) => prev.filter((item) => item.key !== key));
  };

  // Base columns (before ordering/visibility)
  const baseColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      sorter: (a, b) => a.id - b.id,
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      editable: true,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      editable: true,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      editable: true,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
      width: 80,
      editable: true,
    },
    {
      title: "Birth Date",
      dataIndex: "birthDate",
      key: "birthDate",
      sorter: (a, b) =>
        new Date(a.birthDate) - new Date(b.birthDate),
      editable: true,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
      ],
      onFilter: (value, record) => record.gender === value,
      render: (gender) => (
        <Tag color={gender === "male" ? "blue" : "magenta"}>
          {gender?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      filters: Array.from(
        new Set(data.map((u) => u.city).filter(Boolean))
      ).map((city) => ({ text: city, value: city })),
      onFilter: (value, record) => record.city === value,
      editable: true,
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      filters: Array.from(
        new Set(data.map((u) => u.company).filter(Boolean))
      ).map((name) => ({ text: name, value: name })),
      onFilter: (value, record) => record.company === value,
      editable: true,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => {
        const editable = isEditing(record);
        if (editable) {
          return (
            <Space>
              <Button
                type="link"
                icon={<SaveOutlined />}
                onClick={() => save(record.key)}
              >
                Save
              </Button>
              <Button
                type="link"
                icon={<CloseOutlined />}
                onClick={cancel}
              >
                Cancel
              </Button>
            </Space>
          );
        }
        return (
          <Space>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => edit(record)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete this user?"
              onConfirm={() => handleDelete(record.key)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const columnMap = new Map(baseColumns.map((c) => [c.key, c]));

  const orderedColumns = columnsOrder
    .map((key) => columnMap.get(key))
    .filter(Boolean);

  const visibleColumns = orderedColumns.filter((col) =>
    visibleColumnKeys.includes(col.key)
  );

  // Column drag
  const handleColDragStart = (visibleIndex) => {
    setDragColVisibleIndex(visibleIndex);
  };

  const handleColDrop = (visibleIndex) => {
    if (dragColVisibleIndex === null || dragColVisibleIndex === visibleIndex)
      return;

    const fromKey = visibleColumns[dragColVisibleIndex].key;
    const toKey = visibleColumns[visibleIndex].key;

    const fromOrderIndex = columnsOrder.indexOf(fromKey);
    const toOrderIndex = columnsOrder.indexOf(toKey);

    if (fromOrderIndex === -1 || toOrderIndex === -1) return;

    setColumnsOrder((prev) => arrayMove(prev, fromOrderIndex, toOrderIndex));
    setDragColVisibleIndex(null);
  };

  const draggableColumns = visibleColumns.map((col, index) => ({
    ...col,
    onHeaderCell: () => ({
      draggable: col.key !== "actions",
      onDragStart: () => handleColDragStart(index),
      onDragOver: (e) => e.preventDefault(),
      onDrop: () => handleColDrop(index),
      style: { cursor: col.key !== "actions" ? "move" : "default" },
    }),
  }));

  // Editable cell
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    children,
    ...restProps
  }) => (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please input ${title}`,
            },
          ]}
        >
          <Input size="small" />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );

  const mergedColumns = draggableColumns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  // Search
  const filteredData = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return data;
    return data.filter((u) => {
      const values = [
        u.id,
        u.name,
        u.username,
        u.email,
        u.phone,
        u.age,
        u.birthDate,
        u.gender,
        u.city,
        u.company,
      ].map((v) => (v !== undefined && v !== null ? String(v) : ""));
      return values.some((val) => val.toLowerCase().includes(q));
    });
  }, [data, searchValue]);

  // Row drag (key-based, works with pagination)
  const onRow = (record) => ({
    draggable: true,
    onDragStart: () => setDragRowKey(record.key),
    onDragOver: (e) => e.preventDefault(),
    onDrop: () => {
      if (!dragRowKey || dragRowKey === record.key) return;
      setData((prev) => {
        const fromIndex = prev.findIndex((item) => item.key === dragRowKey);
        const toIndex = prev.findIndex((item) => item.key === record.key);
        if (fromIndex === -1 || toIndex === -1) return prev;
        return arrayMove(prev, fromIndex, toIndex);
      });
      setDragRowKey(null);
    },
    style: { cursor: "grab" },
  });

  // Column Display popover
  const selectableColumns = baseColumns.filter(
    (c) => c.key !== "actions"
  );

  const handleToggleColumn = (key, checked) => {
    setVisibleColumnKeys((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, key]));
      }
      const next = prev.filter((k) => k !== key);
      // Always keep ID and actions visible
      if (!next.includes("id")) next.unshift("id");
      if (!next.includes("actions")) next.push("actions");
      return next;
    });
  };

  const handleColumnsReset = () => {
    setColumnsOrder(ALL_COLUMN_KEYS);
    setVisibleColumnKeys(ALL_COLUMN_KEYS);
  };

  const columnDisplayContent = (
    <div style={{ padding: 12, minWidth: 220 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Text strong>Column Display</Text>
        <Button type="link" size="small" onClick={handleColumnsReset}>
          Reset
        </Button>
      </div>

      {selectableColumns.map((col) => (
        <div
          key={col.key}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <HolderOutlined style={{ marginRight: 8, color: "#999" }} />
          <Checkbox
            checked={visibleColumnKeys.includes(col.key)}
            onChange={(e) => handleToggleColumn(col.key, e.target.checked)}
          >
            {col.title}
          </Checkbox>
        </div>
      ))}
    </div>
  );

  // Global reset
  const handleGlobalReset = () => {
    setSearchValue("");
    setColumnsOrder(ALL_COLUMN_KEYS);
    setVisibleColumnKeys(ALL_COLUMN_KEYS);
    setEditingKey("");
    setTableInstanceKey((k) => k + 1);
  };

  return (
    <div>
      {/* TOP BAR */}
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 16,
          flexWrap: "wrap",
          rowGap: 8,
        }}
      >
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          onClear={() => setSearchValue("")}
        />

        <Space>
          <Popover content={columnDisplayContent} trigger="click">
            <Button icon={<FilterOutlined />}>Column Display</Button>
          </Popover>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleGlobalReset}
          >
            Reset
          </Button>
        </Space>
      </Space>

      {/* Info text */}
      <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
        Showing {filteredData.length} of {data.length} users · You can drag
        rows and column headers.
      </Text>

      {/* TABLE */}
      <Form form={form} component={false}>
        <Table
          key={tableInstanceKey}
          loading={loading}
          dataSource={filteredData}
          columns={mergedColumns}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowKey="key"
          size="large"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
          scroll={{ y: 400, x: "max-content" }}
          sticky
          onRow={onRow}
        />
      </Form>
    </div>
  );
}

export default UserTable;
