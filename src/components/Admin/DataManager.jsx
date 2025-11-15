import React, { useState, useCallback } from 'react';
import { saveAs } from 'file-saver/dist/FileSaver.min.js';
import { Button, Modal, Checkbox, Alert, Spin } from 'antd';
import { ExportOutlined, ImportOutlined, ReloadOutlined } from '@ant-design/icons';
import { STORAGE_KEY } from '../../utils/api';

const DataManager = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mode, setMode] = useState('export');
  const [selectedEntities, setSelectedEntities] = useState({
    employees: true,
    leaders: true,
    fleet: true,
    applications: false,
    news: false,
    database: false
  });
  const [importData, setImportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const entityLabels = {
    employees: 'Сотрудники',
    leaders: 'Руководство',
    fleet: 'Автопарк',
    applications: 'Заявления',
    news: 'Новости',
    database: 'База данных'
  };

  const handleExport = useCallback(() => {
    setMode('export');
    setIsModalVisible(true);
  }, []);

  const handleImport = useCallback(() => {
    setMode('import');
    setImportData(null);
    setError('');
    setIsModalVisible(true);
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setImportData(data);
        setError('');
      } catch (err) {
        setError('Некорректный формат файла');
      }
    };
    reader.readAsText(file);
  };

  const executeExport = () => {
    const currentData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const dataToExport = {};

    Object.keys(selectedEntities).forEach(key => {
      if (selectedEntities[key] && currentData[key]) {
        dataToExport[key] = currentData[key];
      }
    });

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    saveAs(blob, `mvdsai-export-${new Date().toISOString().split('T')[0]}.json`);
    setIsModalVisible(false);
  };

  const executeImport = () => {
    if (!importData) {
      setError('Нет данных для импорта');
      return;
    }

    setLoading(true);
    try {
      const currentData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const updatedData = { ...currentData, ...importData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      setLoading(false);
      setIsModalVisible(false);
      window.location.reload();
    } catch (err) {
      setError('Ошибка при импорте данных');
      setLoading(false);
    }
  };

  const renderModalContent = () => {
    if (mode === 'export') {
      return (
        <div>
          <p>Выберите данные для экспорта:</p>
          {Object.keys(entityLabels).map(key => (
            <div key={key}>
              <Checkbox
                checked={!!selectedEntities[key]}
                onChange={(e) => setSelectedEntities(prev => ({ ...prev, [key]: e.target.checked }))}
              >
                {entityLabels[key]}
              </Checkbox>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div>
        <input 
          type="file" 
          accept=".json" 
          onChange={handleFileUpload} 
          style={{ display: 'block', marginBottom: '16px' }}
        />
        {error && <Alert message={error} type="error" style={{ marginBottom: '16px' }} />}
        {importData && (
          <div style={{ marginTop: '16px' }}>
            <h4>Будут загружены:</h4>
            <pre style={{ 
              maxHeight: '200px', 
              overflow: 'auto', 
              background: '#f5f5f5', 
              padding: '10px',
              borderRadius: '4px'
            }}>
              {JSON.stringify(importData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="data-manager" style={{ margin: '16px 0' }}>
      <Button
        type="primary"
        icon={<ExportOutlined />}
        onClick={handleExport}
        style={{ marginRight: '8px' }}
      >
        Экспорт
      </Button>
      <Button
        icon={<ImportOutlined />}
        onClick={handleImport}
        style={{ marginRight: '8px' }}
      >
        Импорт
      </Button>
      <Button
        danger
        icon={<ReloadOutlined />}
        onClick={() => {
          if (window.confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
            localStorage.removeItem(STORAGE_KEY);
            window.location.reload();
          }
        }}
      >
        Сбросить всё
      </Button>

      <Modal
        title={mode === 'export' ? 'Экспорт данных' : 'Импорт данных'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setImportData(null);
          setError('');
        }}
        onOk={mode === 'export' ? executeExport : executeImport}
        confirmLoading={loading}
        okText={mode === 'export' ? 'Экспортировать' : 'Импортировать'}
        cancelText="Отмена"
        width={600}
      >
        {loading ? <Spin /> : renderModalContent()}
      </Modal>
    </div>
  );
};

export default DataManager;
