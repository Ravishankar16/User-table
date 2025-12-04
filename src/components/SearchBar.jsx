import React, { useEffect, useState } from "react";
import { Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

function SearchBar({ value, onChange, onClear }) {
  const [innerValue, setInnerValue] = useState(value || "");

  useEffect(() => {
    setInnerValue(value || "");
  }, [value]);

  // Debounce
  useEffect(() => {
    const id = setTimeout(() => {
      onChange(innerValue);
    }, 400);
    return () => clearTimeout(id);
  }, [innerValue, onChange]);

  const handleClear = () => {
    setInnerValue("");
    onClear();
  };

  return (
    <Space>
      <Input
        value={innerValue}
        onChange={(e) => setInnerValue(e.target.value)}
        placeholder="Global search in any column"
        prefix={<SearchOutlined />}
        allowClear
        style={{ width: 360 }}
      />
      <Button type="primary" onClick={handleClear}>
        Clear
      </Button>
    </Space>
  );
}

export default SearchBar;
