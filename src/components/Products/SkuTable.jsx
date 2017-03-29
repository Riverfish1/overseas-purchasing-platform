import React, { Component } from 'react';
import { Row, Col, Form, Table, Input, InputNumber, Button, Popconfirm, Upload, Icon, Cascader, message, Popover, Checkbox, Select, Modal } from 'antd';

import styles from './Products.less';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

function getScaleOptions(batchSkuSort, scaleTypes) {
  const filteredBatchOptions = scaleTypes.filter((el) => {
    el.id = el.id.toString();
    return el.id === batchSkuSort.toString();
  });

  const targetBatchOptions = filteredBatchOptions.length > 0 ? filteredBatchOptions[0].scaleList : [];

  const scaleOptions = targetBatchOptions.map((el) => {
    el.label = el.name.toString();
    el.value = el.name.toString();
    return el;
  });

  return scaleOptions;
}

class SkuTable extends Component {
  constructor() {
    super();
    this.state = {
      skuData: [],
      batchSkuAddVisible: false,
      batchSkuSort: '',
      batchSelected: [],
      previewVisible: false,
      previewImage: '',
    };
  }
  componentWillReceiveProps(...args) {
    if (args[0].data instanceof Array && args[0].data.length > 0 && this.state.skuData.length === 0) {
      this.initData(args[0].data);
    }
  }
  getValue(callback) {
    const { form } = this.props;
    const skuList = [];
    form.validateFieldsAndScroll((err, fieldsSku) => {
      if (err) {
        return;
      }
      let count = 1;
      const keys = Object.keys(fieldsSku);
      while (Object.prototype.hasOwnProperty.call(fieldsSku, `r_${count}_virtualInv`)) {
        const skuSingle = {};
        keys.forEach((key) => {
          if (key.match(`r_${count}_`) && fieldsSku[key]) {
            skuSingle[key.split(`r_${count}_`)[1]] = fieldsSku[key];
          }
        });
        skuSingle.packageLevelId = JSON.stringify(skuSingle.packageLevelId); // 数组转字符串
        // 处理图片
        if (skuSingle.mainPic) {
          const uploadMainPic = [];
          skuSingle.mainPic.fileList.forEach((el, index) => {
            uploadMainPic.push({
              type: el.type,
              uid: `i_${index}`,
              url: el.url,
            });
          });
          skuSingle.mainPic = JSON.stringify({ picList: uploadMainPic });
        }
        skuList.push(skuSingle);
        count += 1;
      }
      if (skuList.length < 1) {
        message.error('请至少填写一项sku信息');
        return;
      }
      if (callback) callback(skuList);
    });
  }
  clearValue() {
    const { form } = this.props;
    this.setState({ skuData: [] }, () => {
      form.resetFields();
    });
  }
  initData(data) {
    data.forEach((el, index) => {
      el.key = index + 1;
    });
    this.setState({ skuData: data });
  }
  addItem(scale, color, salePrice) {
    const { skuData } = this.state;
    const skuLen = skuData.length;
    const lastId = skuLen < 1 ? 0 : skuData[skuData.length - 1].key;
    const newId = parseInt(lastId, 10) + 1;
    const newItem = {
      // id: newId,
      key: newId,
      scale: typeof scale === 'string' ? scale : '',
      color: typeof color === 'string' ? color : '',
      virtualInv: '',
      packageLevelId: [],
      skuCode: '',
      salePrice: typeof salePrice === 'string' ? salePrice : '',
      weight: '',
      mainPic: '',
    };
    skuData.push(newItem);
    this.setState({ skuData });
  }
  delItem(key) {
    console.log(key);
    const { skuData } = this.state;
    const newSkuData = skuData.filter(item => key !== item.key);
    this.setState({ skuData: newSkuData }, () => {
      setTimeout(() => {
        this.setState({ skuData: newSkuData.map((el, index) => { el.key = index + 1; return el; }) });
      }, 100);
    });
  }
  checkImg(rules, values, callback) {
    callback();
  }
  handleBatchSkuAddVisible(batchSkuAddVisible) {
    if (!batchSkuAddVisible) {
      const { batchSelected } = this.state;
      const salePrice = this.salePrice.refs.input.value;
      const color = this.color.refs.input.value;
      batchSelected.forEach((el) => {
        this.addItem(el, salePrice, color);
      });
      this.setState({ batchSkuSort: '', batchSelected: [] });
      this.salePrice.refs.input.value = '';
      this.color.refs.input.value = '';
    }
    this.setState({ batchSkuAddVisible });
  }
  changeBatchSkuType(type) {
    this.setState({ batchSkuSort: type });
    if (type) {
      this.setState({ batchSelected: getScaleOptions(type, this.props.scaleTypes).map(el => el.name) });
    }
  }
  handleBatchSelect(batchSelected) {
    this.setState({ batchSelected });
  }
  handleCancel() {
    this.setState({ previewVisible: false });
  }
  render() {
    const p = this;
    const { form, parent, packageScales, scaleTypes } = this.props;
    const { getFieldDecorator } = form;
    const { skuData, batchSkuSort, batchSelected, previewImage, previewVisible } = this.state;
    let picList = [];
    if (skuData) {
      skuData.forEach((el) => {
        if (el.mainPic) {
          const picObj = JSON.parse(el.mainPic);
          picList = picObj.picList || [];
        }
      });
    }

    // 注册props
    if (!parent.clearSkuValue) parent.clearSkuValue = this.clearValue.bind(this);
    if (!parent.getSkuValue) parent.getSkuValue = this.getValue.bind(this);

    const uploadProps = {
      action: '/haierp1/uploadFile/picUpload',
      listType: 'picture-card',
      data(file) {
        return {
          pic: file.name,
        };
      },
      beforeUpload(file) {
        const isImg = file.type === 'image/jpeg' || file.type === 'image/bmp' || file.type === 'image/gif' || file.type === 'image/png';
        if (!isImg) { message.error('请上传图片文件'); }
        return isImg;
      },
      name: 'pic',
      onPreview(file) {
        p.setState({
          previewImage: file.url,
          previewVisible: true,
        });
      },
      onChange(info) {
        if (info.file.status === 'done') {
          if (info.file.response && info.file.response.success) {
            message.success(`${info.file.name} 成功上传`);
            // 添加文件预览
            const newFile = info.file;
            info.fileList = info.fileList.slice(-1);
            newFile.url = info.file.response.data;
          } else { message.error(`${info.file.name} 解析失败：${info.file.response.msg || info.file.response.errorMsg}`); }
        } else if (info.file.status === 'error') { message.error(`${info.file.name} 上传失败`); }
      },
    };

    const modalTableProps = {
      columns: [
        {
          title: 'SKU条码',
          dataIndex: 'skuCode',
          key: 'skuCode',
          width: '12%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_skuCode`, { initialValue: t || '' })(
                  r.skuCode ? <Input placeholder="请填写SKU条码" disabled /> : <span style={{ color: '#ccc' }}>自动生成</span>,
                )}
              </FormItem>
            );
          },
        },
        {
          title: '尺寸',
          dataIndex: 'scale',
          key: 'scale',
          width: '12%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_scale`, { initialValue: t || '', rules: [{ required: true, message: '该项必填' }] })(
                  <Input placeholder="请填写" />)}
                {getFieldDecorator(`r_${r.key}_id`, { initialValue: r.id || null })(
                  <Input style={{ display: 'none' }} />)}
              </FormItem>
            );
          },
        },
        {
          title: '颜色',
          dataIndex: 'color',
          key: 'color',
          width: '12%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_color`, { initialValue: t || '', rules: [{ required: true, message: '该项必填' }] })(
                  <Input placeholder="请填写" />)}
              </FormItem>
            );
          },
        },
        {
          title: '销售价格',
          dataIndex: 'salePrice',
          key: 'salePrice',
          width: '12%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_salePrice`, { initialValue: t || '', rules: [{ required: true, message: '该项必填' }] })(
                  <InputNumber step={0.01} min={0} placeholder="请填写" />)}
              </FormItem>
            );
          },
        },
        {
          title: '虚拟库存',
          dataIndex: 'virtualInv',
          key: 'virtualInv',
          width: '12%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_virtualInv`, {
                  initialValue: t || '', rules: [{ required: true, message: '该项必填' }],
                })(
                  <InputNumber step={1} min={0} placeholder="请填写" />)}
              </FormItem>
            );
          },
        },
        {
          title: '重量(KG)',
          dataIndex: 'weight',
          key: 'weight',
          width: '12%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_weight`, { initialValue: t || '', rules: [{ required: true, message: '该项必填' }] })(
                  <InputNumber step={0.01} min={0} placeholder="请填写" />)}
              </FormItem>
            );
          },
        },
        {
          title: '商品图片',
          dataIndex: 'mainPic',
          key: 'mainPic',
          width: '12%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_mainPic`, {
                  initialValue: picList,
                  valuePropName: 'fileList',
                  getValueFromEvent(e) {
                    if (!e || !e.fileList) {
                      return e;
                    }
                    const { fileList } = e;
                    return fileList;
                  },
                  rules: [{ validator: p.checkImg.bind(p) }],
                })(
                  <Upload {...uploadProps} className={styles.picStyle}>
                    <Icon type="plus" style={{ fontSize: 12 }} />
                  </Upload>,
                )}
              </FormItem>
            );
          },
        },
        {
          title: '包装规格',
          dataIndex: 'packageLevelId',
          key: 'packageLevelId',
          width: '20%',
          render(t, r) {
            return (
              <FormItem>
                {getFieldDecorator(`r_${r.key}_packageLevelId`, {
                  initialValue: t && typeof t === 'string' ? t.match(/\[/g) ? JSON.parse(t) : t.split(',') : '',
                  rules: [{ required: true, message: '该项必选' }],
                })(
                  <Cascader options={packageScales} placeholder="请选择" />)}
              </FormItem>
            );
          },
        },
        {
          title: '操作',
          key: 'operator',
          render(text, record) {
            return (
              <Popconfirm title="确定删除?" onConfirm={p.delItem.bind(p, record.key)}>
                <a href="javascript:void(0)">删除</a>
              </Popconfirm>
            );
          },
        },
      ],
      dataSource: skuData,
      bordered: false,
    };

    const scaleOptions = getScaleOptions(batchSkuSort, scaleTypes);
    const BatchSkuAdd = (
      <div style={{ width: 400 }}>
        <Select placeholder="请选择类型" value={batchSkuSort || undefined} style={{ width: 200, marginTop: 10 }} onChange={this.changeBatchSkuType.bind(this)}>
          {scaleTypes.map(el => <Option key={el.id} value={el.id}>{el.type}</Option>)}
        </Select>
        <div><Input placeholder="请输入颜色" style={{ marginTop: 10, width: 200 }} ref={(c) => { this.color = c; }} /></div>
        <Input placeholder="请输入售价" style={{ marginTop: 10, width: 200 }} ref={(c) => { this.salePrice = c; }} />
        {scaleOptions.length > 0 && <div style={{ height: 10 }} />}
        <CheckboxGroup options={scaleOptions} value={batchSelected} onChange={this.handleBatchSelect.bind(this)} />
        <div style={{ height: 20 }} />
        <Button type="primary" size="small" onClick={this.handleBatchSkuAddVisible.bind(this, false)}>添加</Button>
        <Button style={{ marginLeft: 10 }} size="small" onClick={() => this.setState({ batchSkuAddVisible: false })}>关闭</Button>
      </div>
    );

    return (
      <Row>
        <Col className={styles.productModalBtn}>
          <Button type="primary" onClick={this.addItem.bind(this)}>新增SKU</Button>
          <Popover
            content={BatchSkuAdd}
            title="选择分类"
            trigger="click"
            visible={this.state.batchSkuAddVisible}
          >
            <Button type="ghost" style={{ marginLeft: 10 }} onClick={this.handleBatchSkuAddVisible.bind(this, true)}>批量新增SKU</Button>
          </Popover>
        </Col>
        <Table
          {...modalTableProps}
          rowKey={record => record.key}
          pagination={false}
        />
        <Modal visible={previewVisible} title="预览图片" footer={null} onCancel={this.handleCancel.bind(this)}>
          <img role="presentation" src={previewImage} style={{ width: '100%' }} />
        </Modal>
      </Row>
    );
  }
}

export default Form.create()(SkuTable);
