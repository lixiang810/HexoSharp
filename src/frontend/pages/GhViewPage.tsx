import { Card, CardContent, Typography } from '@mui/material';
import { decode } from 'js-base64';
import React from 'react';
import IDirState from '../../types/IDirState';
import IFileState from '../../types/IFileState';
import Files from '../components/Files';
import ImgPreview from '../components/ImgPreview';
import MdPreview from '../components/MdPreview';
import PreviewActions from '../components/PreviewActions';
import useGhPath from '../hooks/useGhPath';
import { changeLoading } from '../redux/loadingReducer';
import { useAppDispatch, useAppSelector } from '../redux/store';
import lscat from '../service/lscat';
import isPicture from '../utils/isPicture';

/** 文件预览页面，现支持预览 Markdown、mdx 文件和图片 */
const GhViewPage: React.FC = () => {
  const settings = useAppSelector((state) => state.settings.settings);
  const dispatch = useAppDispatch();
  const [data, setData] = React.useState<IDirState | IFileState>({ type: 'dir', data: [] });
  const path = useGhPath();
  React.useEffect(() => {
    (async () => {
      dispatch(changeLoading(true));
      if (!settings.owner || !settings.repo) return null;
      const res = await lscat({ owner: settings.owner, repo: settings.repo, path });
      if (!res) return null;
      if (res.type !== 'notExist') {
        setData(res);
        return dispatch(changeLoading(false));
      }
      setData({ type: 'dir', data: [] });
      return dispatch(changeLoading(false));
    })();
  }, [path, settings.owner, settings.repo, dispatch]);
  if (data.type === 'dir') {
    return <Files data={data} />;
  }
  if (data.data.name.endsWith('.md') || data.data.name.endsWith('.mdx')) {
    return <MdPreview sha={data.data.sha} value={decode(data.data.content || '')} />;
  }
  if (isPicture(data.data.name))
    return (
      <ImgPreview sha={data.data.sha} url={data.data.download_url!} filename={data.data.name} />
    );
  return (
    <Card>
      <PreviewActions sha={data.data.sha} />
      <CardContent>
        <Typography component="div" sx={{ whiteSpace: 'pre-line' }}>
          {decode(data.data.content || '')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GhViewPage;
