import { AppProps } from '@/App';
import { ViewportProvider } from '@/components/customResizeHook';
import { prefix } from '@/constant';
import { Spin } from 'antd';
import { Layout } from 'antd/es';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import AnnotationOperation from './annotationOperation';
import AnnotationTips from './annotationTips';
// import Sidebar from './sidebar';
import RightSiderbar from './rightSiderBar';
import ToolFooter from './toolFooter';
import ToolHeader from './toolHeader';
// import { getStepConfig } from '@/store/annotation/reducer';
import { cTool } from '@label-u/annotation';
// import { ChangeSave } from '../../store/annotation/actionCreators';
import VideoAnnotate from '@/components/videoAnnotate';
import { AppState } from '@/store';
import { connect } from 'react-redux';
import AttributeOperation from './attributeOperation';
import { IFileItem } from '@/types/data';
import LeftSider from './leftSiderBar';
import classNames from 'classnames';

const { EVideoToolName } = cTool;

interface IProps {
  path: string;
  loading: boolean;
  imgList: IFileItem;
  currentToolName: string;
  imgIndex: string;
  imgListCollapse: boolean;
}

const { Sider, Content } = Layout;

const layoutCls = `${prefix}-layout`;

const ImageAnnotate: React.FC<AppProps & IProps> = (props) => {
  return (
    <>
      {props.showTips === true && <AnnotationTips tips={props.path} />}
      <AnnotationOperation {...props} />
      <ToolFooter style={props.style?.footer} mode={props.mode} footer={props?.footer} />
    </>
  );
};

const AnnotatedArea: React.FC<AppProps & IProps & { currentToolName: string }> = (props) => {
  const { currentToolName } = props;
  // @ts-ignore
  const isVideoTool = Object.values(EVideoToolName).includes(currentToolName);
  if (isVideoTool) {
    return <VideoAnnotate {...props} />;
  }
  return <ImageAnnotate {...props} />;
};

const MainView: React.FC<AppProps & IProps> = (props) => {
  // const dispatch = useDispatch();
  const { currentToolName } = props;

  const [boxHeight,setBoxHeight] = useState<number>();
  const [boxWidth,setBoxWidth] = useState<number>();

  debugger;
  useEffect(()=>{
    let boxParent = document.getElementById('annotationCotentAreaIdtoGetBox')?.parentNode as HTMLElement;
    setBoxHeight(boxParent.clientHeight);
    setBoxWidth(boxParent.clientWidth);
    debugger;
  })


  // 取消加载时loading
  return (
    <ViewportProvider>
      <Spin spinning={false}>
        <Layout
          className={classNames({
            'lab-layout': true,
            'lab-layout-preview': props.isPreview,
          })}
          style={props.style?.layout}
        >
          <header className={`${layoutCls}__header`} style={props.style?.header}>
            <ToolHeader
              isPreview={props?.isPreview}
              header={props?.header}
              headerName={props.headerName}
              goBack={props.goBack}
              exportData={props.exportData}
              topActionContent={props.topActionContent}
            />
          </header>
          <AttributeOperation />
          <Layout>
            {<LeftSider {...props} />}
            <Content className={`${layoutCls}__content`} style={{height:boxHeight}}>
              <AnnotatedArea {...props} currentToolName={currentToolName} />
            </Content>
            <Sider className={`${layoutCls}__side`} width='auto' style={props.style?.sider}>
              {/* <Sidebar sider={props?.sider} /> */}
              <RightSiderbar isPreview={props?.isPreview as boolean} />
            </Sider>
          </Layout>
        </Layout>
      </Spin>
    </ViewportProvider>
  );
};

const mapStateToProps = ({ annotation, toolStyle }: AppState) => {
  const { imgList, loading, imgIndex } = annotation;
  const { imgListCollapse } = toolStyle;
  const imgInfo = imgList[annotation.imgIndex] ?? {};
  return {
    path: imgInfo?.url ?? imgInfo?.path ?? '', // 将当前路径的数据注入
    loading,
    imgList,
    imgIndex,
    imgListCollapse,
  };
};

export default connect(mapStateToProps)(MainView);
