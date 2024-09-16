import { Upload, Col, Row, Form } from 'antd';
import { useState, useEffect } from 'react';
import { notifyError } from '~/utils/notifications';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ModalCustomImage = (props) => {
    const [img, setImg] = useState([]);
    const beforeUpload = async (file, afile) => {
        let newFile = await getBase64(file);
        if (
            file.type === 'image/jpeg' ||
            file.type === 'image/png' ||
            file.type === 'image/webp' ||
            file.type === 'image/heic'
        ) {
            props.getSrcImage(newFile);
        } else {
            notifyError('You need upload type image.');
        }
        return false;
    };
    useEffect(() => {
        if (props.stateImg) {
            setImg([]);
            props.setStateImg(false);
        }
        if (props.initialValues) {
            let src = props.initialValues.image_data;
            setImg([
                {
                    uid: '-4',
                    name: 'image.png',
                    status: 'done',
                    url: src,
                },
            ]);
        }
    }, [props.stateImg, props.initialValues]);
    const onChange = ({ fileList: newImg }) => {
        if (newImg && newImg.length == 0) {
            props.getSrcImage('');
        }
        setImg(newImg);
    };
    return (
        <Row>
            <Col span={6}>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={img}
                    onChange={onChange}
                    beforeUpload={beforeUpload}
                >
                    {img && img.length == 0 ? '+ Upload' : ''}
                </Upload>
                <Form.Item name="image_data" hidden={true}>
                    <input type="textarea" placeholder="Please enter title color" />
                </Form.Item>
            </Col>
        </Row>
    );
};
export default ModalCustomImage;
