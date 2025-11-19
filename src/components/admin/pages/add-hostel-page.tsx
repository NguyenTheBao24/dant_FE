"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Button } from "@/components/admin/ui/button";
import { Badge } from "@/components/admin/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import { Building2, MapPin, PenSquare, PlusCircle, Trash2 } from "lucide-react";
// @ts-ignore
import { listQuanLy } from "@/services/quan-ly.service";

interface AddHostelPageProps {
  hostels?: any[];
  onSubmit?: (payload: any) => Promise<void> | void;
  onDelete?: (hostelId: number) => Promise<void> | void;
  onUpdate?: (hostelId: number, payload: any) => Promise<void> | void;
}

const defaultForm = {
  ten_toa: "",
  dia_chi: "",
  quan_ly_id: "",
  so_can_ho: "10",
};

export function AddHostelPage({
  hostels = [],
  onSubmit,
  onDelete,
  onUpdate,
}: AddHostelPageProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editHostel, setEditHostel] = useState<any | null>(null);
  const [editForm, setEditForm] = useState(defaultForm);
  const [managerOptions, setManagerOptions] = useState<any[]>([]);
  const [isLoadingManagers, setIsLoadingManagers] = useState(false);

  const totalRooms = useMemo(
    () => hostels.reduce((sum, h) => sum + (h.rooms || h.so_can_ho || 0), 0),
    [hostels]
  );
  const occupancyAverage = useMemo(() => {
    if (!hostels.length) return 0;
    const total = hostels.reduce((sum, h) => sum + (h.occupancy || 0), 0);
    return Math.round(total / hostels.length);
  }, [hostels]);

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleEditChange(field: string, value: string) {
    setEditForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleCreate() {
    const payload = {
      ten_toa: form.ten_toa.trim(),
      dia_chi: form.dia_chi.trim(),
      quan_ly_id: form.quan_ly_id ? Number(form.quan_ly_id) : null,
      so_can_ho: Number(form.so_can_ho || 10),
    };
    if (!payload.ten_toa || !payload.dia_chi) {
      alert("Vui lòng nhập tên và địa chỉ khu trọ");
      return;
    }
    await onSubmit?.(payload);
    setForm(defaultForm);
    setCreateDialogOpen(false);
  }

  async function handleUpdate() {
    if (!editHostel) return;
    const payload = {
      ten_toa: editForm.ten_toa.trim(),
      dia_chi: editForm.dia_chi.trim(),
      quan_ly_id: editForm.quan_ly_id ? Number(editForm.quan_ly_id) : null,
    };
    if (!payload.ten_toa || !payload.dia_chi) {
      alert("Tên và địa chỉ không được bỏ trống");
      return;
    }
    await onUpdate?.(editHostel.id, payload);
    setEditDialogOpen(false);
  }

  function openEditDialog(hostel: any) {
    setEditHostel(hostel);
    setEditForm({
      ten_toa: hostel.ten_toa || hostel.name || "",
      dia_chi: hostel.dia_chi || hostel.address || "",
      quan_ly_id: hostel.manager?.id || "",
      so_can_ho: String(hostel.rooms || hostel.so_can_ho || 0),
    });
    setEditDialogOpen(true);
  }

  const getHostelName = (hostel: any) =>
    hostel.ten_toa || hostel.name || "Chưa đặt tên";
  const getHostelAddress = (hostel: any) =>
    hostel.dia_chi || hostel.address || "Chưa có địa chỉ";
  const getManagerName = (hostel: any) =>
    hostel.manager?.name || hostel.manager?.ho_ten || "Chưa phân công";

  useEffect(() => {
    const loadManagers = async () => {
      setIsLoadingManagers(true);
      try {
        const data = await listQuanLy();
        setManagerOptions(data || []);
      } catch (error) {
        console.error("Failed to load managers:", error);
      } finally {
        setIsLoadingManagers(false);
      }
    };
    loadManagers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Tài sản
          </p>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý khu trọ</h2>
          <p className="text-gray-600">
            Tạo mới, cập nhật và phân bổ khu trọ trong hệ thống
          </p>
        </div>
        <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4" />
          Thêm khu trọ
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Tổng khu trọ
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-3xl font-bold">{hostels.length}</span>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Tổng số phòng
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-3xl font-bold">{totalRooms}</span>
              <MapPin className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Tỷ lệ lấp đầy TB
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-3xl font-bold">{occupancyAverage}%</span>
              <PenSquare className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border border-gray-100">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Khu trọ</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Phòng</TableHead>
                <TableHead>Quản lý</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hostels.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-gray-500"
                  >
                    Chưa có khu trọ nào. Nhấn “Thêm khu trọ” để bắt đầu.
                  </TableCell>
                </TableRow>
              )}
              {hostels.map(hostel => (
                <TableRow key={hostel.id}>
                  <TableCell>
                    <div className="font-semibold text-gray-900">
                      {getHostelName(hostel)}
                    </div>
                    <p className="text-xs text-gray-500">ID: {hostel.id}</p>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-700">
                      {getHostelAddress(hostel)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 border-blue-200 text-blue-700"
                      >
                        {hostel.rooms || hostel.so_can_ho || 0} phòng
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 border border-emerald-200"
                      >
                        {hostel.occupancy ?? 0}% lấp đầy
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-700">
                      {getManagerName(hostel)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(hostel)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        if (
                          confirm(`Xóa khu trọ "${getHostelName(hostel)}"?`)
                        ) {
                          onDelete?.(hostel.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3 text-sm text-gray-500">
        <Building2 className="h-4 w-4" />
        Quản lý đầy đủ vòng đời khu trọ ngay tại trang này.
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm khu trọ mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Tên khu trọ</Label>
              <Input
                id="create-name"
                placeholder="Tòa nhà An Bình"
                value={form.ten_toa}
                onChange={e => handleChange("ten_toa", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-address">Địa chỉ</Label>
              <Input
                id="create-address"
                placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
                value={form.dia_chi}
                onChange={e => handleChange("dia_chi", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-room">Số lượng căn hộ</Label>
                <Input
                  id="create-room"
                  type="number"
                  min={1}
                  value={form.so_can_ho}
                  onChange={e => handleChange("so_can_ho", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-manager">Chọn quản lý (tuỳ chọn)</Label>
                <Select
                  value={form.quan_ly_id || "none"}
                  onValueChange={value =>
                    handleChange("quan_ly_id", value === "none" ? "" : value)
                  }
                  disabled={isLoadingManagers}
                >
                  <SelectTrigger id="create-manager">
                    <SelectValue placeholder="Chọn quản lý hiện có" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Chưa gán quản lý</SelectItem>
                    {managerOptions.map(manager => (
                      <SelectItem key={manager.id} value={String(manager.id)}>
                        {manager.ho_ten || manager.name || `QL-${manager.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Huỷ
            </Button>
            <Button onClick={handleCreate}>Tạo khu trọ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa khu trọ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên khu trọ</Label>
              <Input
                id="edit-name"
                value={editForm.ten_toa}
                onChange={e => handleEditChange("ten_toa", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Địa chỉ</Label>
              <Input
                id="edit-address"
                value={editForm.dia_chi}
                onChange={e => handleEditChange("dia_chi", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Số căn hộ (tham khảo)</Label>
                <Input value={editForm.so_can_ho} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-manager">Chọn quản lý</Label>
                <Select
                  value={
                    editForm.quan_ly_id ? String(editForm.quan_ly_id) : "none"
                  }
                  onValueChange={value =>
                    handleEditChange(
                      "quan_ly_id",
                      value === "none" ? "" : value
                    )
                  }
                  disabled={isLoadingManagers}
                >
                  <SelectTrigger id="edit-manager">
                    <SelectValue placeholder="Chọn quản lý hiện có" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Chưa gán quản lý</SelectItem>
                    {managerOptions.map(manager => (
                      <SelectItem key={manager.id} value={String(manager.id)}>
                        {manager.ho_ten || manager.name || `QL-${manager.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Huỷ
            </Button>
            <Button onClick={handleUpdate}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
